import { Link, useLocation, useNavigate } from 'react-router-dom';
import nightwind from 'nightwind/helper';
import { getLS, getLSUser, logOut } from '../utils/appUtils';
import { PubSubEvent, usePub, useSub } from '../hooks/usePubSub';
import { Dropdown } from './base';
import { useState } from 'react';
import TutorialModal from './TutorialModal/TutorialModal';

type BaseProps = {
  children?: any;
  className?: string;
  onClick?: () => void;
  isLoading?: boolean;
  style?: object;
  [x: string]: any;
};
// Icons from ngduc/portable-react
export const Icons = {
  Brightness: ({ className, ...others }: BaseProps) => (
    <svg
      className={`text-gray-600 ${className}`}
      fill="#aaa"
      height="20"
      width="20"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30.736 30.736"
      {...others}
    >
      <path d="M15.367,8.547c-3.768,0-6.822,3.059-6.822,6.818c0,3.768,3.055,6.824,6.822,6.824s6.816-3.057,6.816-6.824 C22.184,11.605,19.135,8.547,15.367,8.547z M15.587,21.076c0-1.262,0-8.49,0-11.414c3.154,0,5.705,2.559,5.705,5.703 C21.292,18.518,18.74,21.076,15.587,21.076z"></path>{' '}
      <path d="M14.122,6.6V1.244C14.122,0.555,14.677,0,15.363,0l0,0c0.691,0,1.247,0.555,1.247,1.244l0,0V6.6 c0,0.688-0.556,1.242-1.247,1.242l0,0C14.677,7.842,14.122,7.287,14.122,6.6L14.122,6.6z"></path>{' '}
      <path d="M14.122,29.488v-5.35c0-0.689,0.556-1.246,1.242-1.246l0,0c0.691,0,1.247,0.557,1.247,1.246l0,0v5.35 c0,0.689-0.556,1.248-1.247,1.248l0,0C14.677,30.736,14.122,30.178,14.122,29.488L14.122,29.488z"></path>{' '}
      <path d="M20.691,10.045c-0.485-0.484-0.485-1.273,0-1.758l0,0l3.784-3.785c0.486-0.484,1.273-0.484,1.761,0l0,0 c0.485,0.486,0.485,1.275,0,1.76l0,0l-3.788,3.783c-0.241,0.242-0.56,0.367-0.879,0.367l0,0 C21.25,10.412,20.932,10.287,20.691,10.045L20.691,10.045z"></path>{' '}
      <path d="M4.498,26.234c-0.486-0.484-0.486-1.273,0-1.76l0,0l3.788-3.783c0.487-0.484,1.274-0.484,1.76,0l0,0 c0.488,0.48,0.488,1.271,0,1.754l0,0l-3.783,3.789C6.017,26.477,5.7,26.596,5.38,26.596l0,0 C5.061,26.596,4.743,26.477,4.498,26.234L4.498,26.234z"></path>{' '}
      <path d="M24.139,16.613c-0.689,0-1.25-0.559-1.25-1.248l0,0c0-0.684,0.561-1.242,1.25-1.242l0,0h5.35 c0.689,0,1.246,0.559,1.246,1.242l0,0c0,0.689-0.557,1.248-1.246,1.248l0,0H24.139L24.139,16.613z"></path>{' '}
      <path d="M1.244,16.613C0.553,16.613,0,16.055,0,15.365l0,0c0-0.684,0.553-1.242,1.244-1.242l0,0h5.349 c0.688,0,1.249,0.559,1.249,1.242l0,0c0,0.689-0.561,1.248-1.249,1.248l0,0L1.244,16.613L1.244,16.613z"></path>{' '}
      <path d="M24.476,26.234l-3.784-3.789c-0.485-0.482-0.485-1.273,0-1.754l0,0c0.481-0.484,1.274-0.484,1.757,0l0,0l3.788,3.783 c0.485,0.486,0.485,1.275,0,1.76l0,0c-0.247,0.242-0.564,0.361-0.883,0.361l0,0C25.031,26.596,24.715,26.477,24.476,26.234 L24.476,26.234z"></path>{' '}
      <path d="M8.285,10.045L4.498,6.262c-0.486-0.484-0.486-1.273,0-1.76l0,0c0.49-0.484,1.279-0.484,1.765,0l0,0l3.783,3.785 c0.488,0.484,0.488,1.273,0,1.758l0,0c-0.246,0.242-0.562,0.367-0.882,0.367l0,0C8.846,10.412,8.526,10.287,8.285,10.045 L8.285,10.045z"></path>
    </svg>
  )
};

export default function AppHeader() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const publish = usePub();
  const [mainKey, setMainKey] = useState('main');
  const [tutorialShowed, setTutorialShowed] = useState(getLS('tutorialShowed', ''));
  const lsUser = getLSUser();
  const isAnonymousUser = !lsUser.name || lsUser.name === 'User' || lsUser.name === 'LOCAL';
  const isLoggedIn = !isAnonymousUser && lsUser?.name;

  useSub(PubSubEvent.SignInDone, (user: any) => {
    setMainKey(user.id);
  });
  // console.log('isAnonymousUser', isAnonymousUser);

  return (
    <header
      key={mainKey}
      className="py-4 flex items-center justify-between border-b border-gray-50 font-medium text-lg"
    >
      <h1 className={`ml-2 cursor-pointer flex items-center`} onClick={() => navigate('/')}>
        <span className="text-3xl ml-2 mr-2 lg:block hidden">
          <img src="/logo.png" className="w-8" />
        </span>{' '}
        Dashb
        <span className="text-gray-300">.io</span>
      </h1>
      <div className="flex gap-6">
        <Link to="/" className={`underlineLink ${pathname === '/' && 'underlineLinkActive'}`}>
          Main
        </Link>
        <Link to="/more" className={`underlineLink ${pathname === '/more' && 'underlineLinkActive'}`}>
          More
        </Link>
      </div>

      <div className="flex items-center">
        <Dropdown label={isAnonymousUser ? 'Profile' : lsUser.name} className="text-sm" ulClassName="ml-[-40px]">
          <button
            className="text-sm link-minor w-28 bg-gray-100 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap cursor-pointer"
            onClick={() => setTutorialShowed('')}
          >
            Tutorial
          </button>
          <button
            className="text-sm link-minor w-28 bg-gray-100 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap cursor-pointer"
            onClick={() => navigate('/settings')}
          >
            Settings
          </button>
          {!isLoggedIn && (
            <button
              className="text-sm link-minor w-28 bg-gray-100 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap cursor-pointer"
              onClick={() => publish(PubSubEvent.SignIn, {})}
            >
              Sign in
            </button>
          )}
          {!isAnonymousUser && isLoggedIn && (
            <button
              className="text-sm link-minor w-28 bg-gray-100 hover:bg-gray-300 py-2 px-4 block whitespace-no-wrap cursor-pointer"
              onClick={() => logOut()}
            >
              Log out
            </button>
          )}
        </Dropdown>
        <button
          className="text-lg mr-4"
          onClick={() => {
            nightwind.toggle();
            publish(PubSubEvent.ThemeChange, {});
          }}
        >
          <Icons.Brightness />
        </button>
      </div>

      {!tutorialShowed && (
        <TutorialModal
          onConfirm={() => {
            localStorage.setItem('tutorialShowed', '1');
            setTutorialShowed('1');
          }}
        />
      )}
    </header>
  );
}
