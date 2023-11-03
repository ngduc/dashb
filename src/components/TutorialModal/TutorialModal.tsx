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
        <div className="flex flex-col gap-2">
          <img src="/demo-01.gif" alt="Tutorial Screenshot" />

          <a className="link-minor" href="https://github.com/ngduc/dashb/blob/main/examples.md" target="_blank">
            See more Dashboard Examples
          </a>
        </div>
      }
      onConfirm={onConfirm}
      onCancel={onConfirm}
      showCancel={false}
    ></Modal>
  );
}
