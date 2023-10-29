import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppContext } from '../../hooks/useAppContext';
import { AiOutlineSetting } from 'react-icons/ai';
import { RiDragMove2Fill } from 'react-icons/ri';
import { PubSubEvent, usePub } from '../../hooks/usePubSub';
import './form.css';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';

type Props = {
  wid: string;
  schema: any;
  onSubmit: (data: any) => void;
};

export default function WidgetSettings({ wid, schema, onSubmit }: Props) {
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
              onChange={handleInputChange}
              className="text-white w-full p-1"
              rows={4}
              defaultValue={settings?.key}
            />
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
              className="text-white"
              defaultValue={settings?.key}
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
    <form className="" onSubmit={handleSubmit(onFormSubmit)}>
      {Object.entries(schema).map(([key, field]) => {
        return renderFormControl(key, field);
      })}
      <button type="submit" className="btn mt-2">
        Submit
      </button>
      <button
        type="button"
        className="btn ml-2"
        onClick={() => {
          publish(PubSubEvent.Delete, wid);
        }}
      >
        Delete
      </button>
    </form>
  );
}

export function MoverIcon() {
  return (
    <span className="absolute right-2 bottom-6 cursor-pointer z-10 opacity-60 hover:opacity-100 text-gray-500">
      <RiDragMove2Fill className="draggableHandle mb-2" />
    </span>
  );
}

export function SettingsIcon({ onClick }: { onClick: () => void }) {
  return (
    <span className="absolute right-2 bottom-2 cursor-pointer z-10 opacity-60 hover:opacity-100 text-gray-500">
      <AiOutlineSetting width={32} height={32} onClick={onClick} />
    </span>
  );
}
