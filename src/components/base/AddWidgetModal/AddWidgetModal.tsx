import { useState } from 'react';
import { Modal } from '..';
import { widgetList } from '../../../widgets';
import { Widget } from '../../../../types';

type Props = {
  onConfirm: (widget: Widget | null) => void;
  onCancel: () => void;
};

export default function AddWidgetModal({ onConfirm, onCancel }: Props) {
  const [selectedWidget, setSelectedWidget] = useState<Widget | null>(null);

  const onClickWidget = (w: Widget) => {
    setSelectedWidget(w);
    onConfirm(w);
  };

  return (
    <Modal
      title="Add Widget"
      bodyClassName="!max-w-[80%]"
      content={
        <div>
          <h3>Select a Widget</h3>
          <ul className="flex flex-wrap mt-2 gap-4 max-h-[400px] overflow-y-scroll">
            {widgetList.map((widget) => {
              // console.log('widget', widget);
              return (
                <li
                  key={widget?.info?.wid ?? ''}
                  className={`relative w-48 h-32 rounded-md border-[1px] border-gray-100 hover:border-gray-300 cursor-pointer`}
                  onClick={() => onClickWidget(widget)}
                  style={{
                    background: `url(${(widget as any)?.info?.thumbnail}) no-repeat center center`,
                    backgroundSize: 'cover'
                  }}
                >
                  <div className="absolute w-full capitalize bottom-0 py-2 text-center bg-gray-100 opacity-80">
                    {widget?.info?.name ?? ''}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      }
      confirmLabel="Confirm"
      onCancel={onCancel}
      // onConfirm={() => onConfirm(selectedWidget)}
      showConfirm={false}
    />
  );
}
