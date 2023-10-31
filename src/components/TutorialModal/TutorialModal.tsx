import { Modal } from '../base';

type Props = {
  onConfirm: () => void;
};
export default function TutorialModal({ onConfirm }: Props) {
  return (
    <Modal
      title="Tutorial"
      bodyClassName="!max-w-[800px]"
      content={
        <div>
          <img src="https://i.ibb.co/4fm3FxR/Kapture-2023-10-31-at-08-37-17.gif" />
        </div>
      }
      onConfirm={onConfirm}
      onCancel={onConfirm}
      showCancel={false}
    ></Modal>
  );
}
