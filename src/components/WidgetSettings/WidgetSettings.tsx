import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineSetting } from 'react-icons/ai';
import { RiDragMove2Fill } from 'react-icons/ri';
import { PubSubEvent, usePub } from '../../hooks/usePubSub';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';
import { Tooltip } from 'react-tooltip';
import './form.css';
import { getLS } from '../../utils/appUtils';
import WidgetSettingsTutorial from './WidgetSettingsTutorial';

type Props = {
  wid: string;
  schema: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

export default function WidgetSettings({ wid, schema, onSubmit, onCancel }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm();
  const { settings, saveSettings } = useWidgetSettings(wid, (settings) => {
    // console.log('--- settings', settings);
    settings ? Object.keys(settings).forEach((k) => setValue(k, settings[k])) : ''; // set setting values to form
  });
  const publish = usePub();

  const onFormSubmit = async (formData: any) => {
    const { data, error } = await saveSettings(formData);
    if (!error) {
      onSubmit(data.settings);
    }
  };

  const handleInputChange = (event: any) => {
    const { name, value } = event.target;
    // console.log('name, value', event.target.checked);
    setValue(name, value);
  };

  const renderFormControl = (key: string, field: any) => {
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'password':
        return (
          <div key={key}>
            <label className="mr-2">{field.label}</label>
            <input
              className={field?.className}
              type={field.type}
              {...register(key)}
              name={key}
              autoFocus={!!field.autoFocus}
              placeholder={field.placeholder}
              onChange={handleInputChange}
              defaultValue={settings?.key}
            />
            {errors && errors[key] && <span>{`${errors[key]?.message}`}</span>}
          </div>
        );
      case 'textarea':
        return (
          <div key={key}>
            <label className="mr-2">{field.label}</label>
            <textarea
              {...register(key)}
              name={key}
              autoFocus={!!field.autoFocus}
              placeholder={field.placeholder}
              onChange={handleInputChange}
              className="text-white w-full p-1"
              rows={4}
              defaultValue={settings?.key}
            />
            {errors && errors[key] && <span>{`${errors[key]?.message}`}</span>}
          </div>
        );
      case 'label':
        return (
          <div key={key}>
            <label className="mr-2">{field.label}</label>
            <div dangerouslySetInnerHTML={{ __html: field?.defaultValue }}></div>
            {errors && errors[key] && <span>{`${errors[key]?.message}`}</span>}
          </div>
        );
      case 'select':
        return (
          <div key={key}>
            <label>{field.label}</label>
            <select
              {...register(key)}
              name={key}
              onChange={handleInputChange}
              className="text-gray-400"
              defaultValue={settings?.key ?? field?.defaultValue}
            >
              {/* Options for select dropdown */}
              {field.options.map((opt: any) => {
                return (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                );
              })}
            </select>
            {errors && errors[key] && <span>{`${errors[key]?.message}`}</span>}
          </div>
        );
      case 'checkbox':
        return (
          <div key={key}>
            <label>
              <input
                type="checkbox"
                {...register(key)}
                // ref={register(key)}
                name={key}
                onChange={(ev) => setValue(key, ev.target.checked)}
                // value={values[key]}
                // defaultValue={settings?.key}
              />
              <span className="ml-2">{field.label}</span>
            </label>
            {errors[key] && <span>{`${errors[key]?.message}`}</span>}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form className="text-sm" onSubmit={handleSubmit(onFormSubmit)}>
      {Object.entries(schema).map(([key, field]) => {
        return renderFormControl(key, field);
      })}

      <div className="flex items-center justify-between mt-2">
        <div className="">
          <button type="submit" className="btn">
            Submit
          </button>
          <button className="btn ml-2" onClick={onCancel}>
            Cancel
          </button>
        </div>
        <div>
          <button
            type="button"
            className="btn ml-2 mr-6"
            onClick={() => {
              publish(PubSubEvent.Delete, wid);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </form>
  );
}

export function MoverIcon() {
  const publish = usePub();
  return (
    <span
      className="fixed left-[362px] bottom-6 cursor-pointer z-10 opacity-60 hover:opacity-100 text-gray-500"
      onMouseDown={() => {
        // don't use onClick as some users try to 'drag' this icon instead of clicking on it
        publish(PubSubEvent.Moving, {});
      }}
    >
      <RiDragMove2Fill className="mb-2" />
    </span>
  );
}

export function SettingsIcon({ wid, onClick }: { wid: string; onClick: () => void }) {
  return (
    <>
      <span
        className="fixed left-[362px] bottom-2 cursor-pointer z-10 opacity-60 hover:opacity-100 text-gray-500"
        data-tooltip-id="setting-tutorial-tooltip"
        data-tooltip-place="right"
      >
        <AiOutlineSetting width={32} height={32} onClick={onClick} />
      </span>

      {wid.startsWith('weather') && <WidgetSettingsTutorial />}
    </>
  );
}
