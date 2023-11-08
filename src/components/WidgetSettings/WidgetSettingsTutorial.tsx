import { useState } from 'react';
import { Tooltip } from 'react-tooltip';
import { getLS } from '../../utils/appUtils';

export default function WidgetSettingsTutorial() {
  const [settingIconTutorialShowed, setSettingIconTutorialShowed] = useState(getLS('settingIconTutorialShowed', ''));
  return (
    <Tooltip
      id="setting-tutorial-tooltip"
      style={{ backgroundColor: 'teal' }}
      isOpen={settingIconTutorialShowed === ''}
      clickable
    >
      <>
        <button
          onClick={() => {
            localStorage.setItem('settingIconTutorialShowed', 'true');
            setSettingIconTutorialShowed(false);
          }}
        >
          <div>Click the Gear Icon to change Widget Settings</div>
          <div>Click the Move Icon to move widgets</div>
        </button>
      </>
    </Tooltip>
  );
}
