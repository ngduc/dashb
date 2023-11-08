import { useNavigate } from 'react-router-dom';
import { Modal } from '../base';

type Props = {
  onConfirm: () => void;
};
export default function TutorialModal({ onConfirm }: Props) {
  const navigate = useNavigate();
  return (
    <Modal
      title="Tutorial"
      bodyClassName="!max-w-[800px]"
      content={
        <div className="flex flex-col gap-2">
          <img src="/demo-02.gif" alt="Tutorial Screenshot" />

          {/* <a
            className="link-minor"
            href="https://github.com/ngduc/dashb/blob/main/documentation/examples.md"
            target="_blank"
          >
            See more Dashboard Examples
          </a> */}
          <a
            className="link-minor"
            onClick={() => {
              navigate('/more');
              onConfirm();
            }}
          >
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
