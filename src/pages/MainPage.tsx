import { useCallback, useEffect, useState } from 'react';
import StockChart from '../widgets/StockChart/StockChart';
import Weather from '../widgets/Weather/Weather';
import ProtectedPage from './ProtectedPage';
import AirQuality from '../widgets/AirQuality/AirQuality';
import Toggl from '../widgets/Toggl/Toggl';

import { WidthProvider, Responsive, Layouts, Layout } from 'react-grid-layout';
import Embed from '../widgets/Embed/Embed';
import LofiPlayer from '../widgets/LofiPlayer/LofiPlayer';
import Note from '../widgets/Note/Note';
import AddWidgetModal from '../components/base/AddWidgetModal/AddWidgetModal';
import { PubSubEvent, usePub, useSub } from '../hooks/usePubSub';
import { generateWID, getLS } from '../utils/appUtils';
import { DefaultLayout, DefaultWidgets } from '../utils/constants';
import { deleteSettings } from '../hooks/useWidgetSettings';
import StockMini from '../widgets/StockMini/StockMini';
import { saveTabDB, saveTabLS } from './MainPageUtils';
import { apiGet } from '../utils/apiUtils';
import { UserWidget, Widget } from '../../types';
import { Link } from 'react-router-dom';
import Quote from '../widgets/Quote/Quote';
import { Toast } from '../components/base';
import RSSReader from '../widgets/RSSReader/RSSReader';
import { isDoubleHeightWidget } from '../widgets';
import AnalogClock from '../widgets/AnalogClock/AnalogClock';
import { useAppContext } from '../hooks/useAppContext';
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function MainPage() {
  const { tabSettings, setTabSettings } = useAppContext();
  const [modalShowed, setModalShowed] = useState(false);
  const [tab, setTab] = useState(0);
  // const [tabSettings, setTabSettings] = useState<any>({});
  const [movingToastShowed, setMovingToastShowed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [userWidgets, setUserWidgets] = useState<UserWidget[]>(getLS(`userWidgets${tab}`, DefaultWidgets, true));
  const [layout, setLayout] = useState<Layout[]>(getLS(`userLayout${tab}`, DefaultLayout, true));
  const [currentBreakpoint, setCurrentBreakpoint] = useState('');

  const getLSLayout = (size: string) => {
    return getLS(`userLayout${tab}${size}`, DefaultLayout, true);
  };

  const [layouts, setLayouts] = useState<Layouts>({
    xl: getLSLayout('xl'),
    lg: getLSLayout('lg'),
    md: getLSLayout('md'),
    sm: getLSLayout('sm'),
    xs: getLSLayout('xs'),
    xxs: getLSLayout('xxs')
  });
  const publish = usePub();

  useEffect(() => {
    const fetchUserSettings = async () => {
      setIsReady(false);
      const token = localStorage.getItem('tk') ?? '';
      if (token) {
        // timestamp for caching many same requests at the same time (up to the same second)
        const timestamp = new Date().toISOString().split('.')[0]; // 2023-11-03T15:06:24 (removed nanosecs)
        const { data } = await apiGet(`/api/user/settings?ts=${timestamp}`, {});
        const newWidgets = (data?.userWidgets ?? []).length > 0 ? data.userWidgets : DefaultWidgets;
        const newLayout = (data?.userLayout ?? []).length > 0 ? data.userLayout : DefaultLayout;
        saveTabLS(0, newWidgets, newLayout);
        setUserWidgets(newWidgets);
        setLayout(newLayout);
        setTabSettings(data?.tab ?? {});
      }
      // TODO: This is a Hack: Grid didn't load col 4, force it to reload col 4.
      setTimeout(() => {
        setLayouts({});
        setTimeout(() => {
          setLayouts({
            xl: layout,
            lg: layout,
            md: layout,
            sm: layout,
            xs: layout,
            xxs: layout
          });
          setIsReady(true);
        }, 10);
      }, 10);
    };
    fetchUserSettings();
  }, []);
  // console.log('isReady', isReady, userWidgets, layout);

  useSub(PubSubEvent.Delete, async (wid: string) => {
    if (confirm('Delete this widget?') === true) {
      // console.log('> layout', layout, userWidgets, wid);
      await deleteSettings(wid);
      setUserWidgets((userWidgets: UserWidget[]) => [...userWidgets].filter((item: UserWidget) => item.wid !== wid));
      setLayout((layout: Layout[]) => [...layout].filter((item: Layout) => item.i !== wid));
      // this triggers onLayoutChange => save Widgets & Layout
    }
  });

  useSub(PubSubEvent.MovingToast, ({ isMoving }: { isMoving: boolean }) => {
    setMovingToastShowed(isMoving);
  });

  const addWidget = (widget: Widget | null) => {
    setModalShowed(false);
    if (widget) {
      const wid = widget?.info?.wid + '-' + generateWID();
      userWidgets.push({
        wid
      });
      const newLayoutItem: Layout = { i: wid, x: 1, y: 1, w: widget?.info?.w ?? 1, h: widget?.info?.h ?? 1 };
      // console.log('newLayoutItem', newLayoutItem);

      const newLayout = [...layout];
      newLayout.push(newLayoutItem);

      setLayout(() => newLayout);
      setLayouts({
        xl: newLayout,
        lg: newLayout,
        md: newLayout,
        sm: newLayout,
        xs: newLayout,
        xxs: newLayout
      });
      // saveTabLS(tab, userWidgets, newLayout);
      // console.log('added', userWidgets, newLayout);
    }
  };

  const onLayoutChange =
    // useCallback(
    (currentLayout: ReactGridLayout.Layout[], allLayouts: Layouts) => {
      // resized done (from XL > LG):
      // onLayoutChange XL => onBreakpointChange LG (if changed => load & setLayout LG) => onLayoutChange LG

      // resized back (LG > XL)
      // onLayoutChange LG => onBreakpointChange XL  => onLayoutChange XL
      if (isReady) {
        if (movingToastShowed) {
          // only save layout when moving widgets
          saveTabLS(tab, userWidgets, currentLayout);
          saveTabDB(tab, userWidgets, currentLayout);
          localStorage.setItem(`userLayout${tab}${currentBreakpoint}`, JSON.stringify(currentLayout));
        }

        // TODO: HACK: for some reason, layout item's h was set to 1 at some point => change them back to 2
        currentLayout.forEach((item: Layout) => {
          if (isDoubleHeightWidget(item.i)) {
            item.h = 2;
          }
        });
        // setLayout(currentLayout);
        // setLayouts({
        //   xl: currentLayout,
        //   lg: currentLayout,
        //   md: currentLayout,
        //   sm: currentLayout,
        //   xs: currentLayout,
        //   xxs: currentLayout
        // });
        // console.log('--- currentLayout', currentLayout, allLayouts, isReady);
      }
    };
  // , []);

  return (
    <ProtectedPage>
      <div
      // style={{
      //   background: `url(https://as1.ftcdn.net/v2/jpg/05/72/26/54/1000_F_572265495_aMlExbdRAhNxoFYv6RT12HB6TRtoGok5.jpg)`,
      //   backgroundSize: 'cover'
      // }}
      >
        <ResponsiveGridLayout
          draggableHandle=".draggableHandle"
          className="layout"
          // layout={layout}
          // layouts={{ xl: layout, lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
          layouts={layouts}
          onBreakpointChange={(newBreakpoint, newCols) => {
            if (newBreakpoint !== currentBreakpoint) {
              // if changed => save LG; load & setLayout LG
              setLayout(getLSLayout(newBreakpoint));
              setLayouts({
                xl: getLSLayout('xl'),
                lg: getLSLayout('lg'),
                md: getLSLayout('md'),
                sm: getLSLayout('sm'),
                xs: getLSLayout('xs'),
                xxs: getLSLayout('xxs')
              });
            }
            setCurrentBreakpoint(newBreakpoint);
            // console.log('onBreakpointChange', newBreakpoint, newCols);
            // setLayouts({ ...layouts });
          }}
          // cols={4}
          breakpoints={{ xl: 1500, lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ xl: 4, lg: 3, md: 2, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={200}
          // width={1600}
          margin={[20, 20]}
          onLayoutChange={onLayoutChange}
          isResizable={false}
        >
          {userWidgets.map((widget: UserWidget, idx: number) => {
            const wid = widget?.wid ?? '';
            const type = wid.split('-')[0];
            const cn = ``;
            switch (type) {
              case 'weather':
                return (
                  <div key={wid} className={cn}>
                    <Weather key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'analogclock':
                return (
                  <div key={wid} className={cn}>
                    <AnalogClock key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'airq':
                return (
                  <div key={wid} className={cn}>
                    <AirQuality key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'embed':
                return (
                  <div key={wid} className={cn}>
                    <Embed key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'lofi':
                return (
                  <div key={wid} className={cn}>
                    <LofiPlayer key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'note':
                return (
                  <div key={wid} className={cn}>
                    <Note key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'quote':
                return (
                  <div key={wid} className={cn}>
                    <Quote key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'rssreader':
                return (
                  <div key={wid} className={cn}>
                    <RSSReader key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'stock':
                return (
                  <div key={wid} className={cn}>
                    <StockChart key={`${wid}-main`} wid={wid} symbol="SPY" />
                  </div>
                );
              case 'stockmini':
                return (
                  <div key={wid} className={cn}>
                    <StockMini key={`${wid}-main`} wid={wid} symbol="SPY" />
                  </div>
                );
              case 'toggl':
                return (
                  <div key={wid} className={cn}>
                    <Toggl key={`${wid}-main`} wid={wid} />
                  </div>
                );
              case 'BREAK':
                return (
                  <div key={idx}>
                    <div key={`${idx}-main`} className="basis-full"></div>
                  </div>
                );
            }
          })}
        </ResponsiveGridLayout>
      </div>

      <div>
        <button className="btn mt-4 ml-4 mb-4" onClick={() => setModalShowed(true)}>
          Add Widget
        </button>
      </div>

      <footer className="ml-4 mt-2 text-sm">
        Dashb.io -{' '}
        <Link to="/more" className="link-minor">
          Dashboard Examples
        </Link>
        {' - '}
        <a href="https://github.com/ngduc/dashb" target="_blank" className="link-minor">
          Github
        </a>
        {' - '}
        <Link to="/terms-of-service" className="link-minor">
          Terms
        </Link>
        {' - '}
        <span>
          <span>To store your layout & widgets: </span>
          <a href="#" className="link-minor" onClick={() => publish(PubSubEvent.SignIn, {})}>
            Sign in
          </a>
        </span>
      </footer>

      {modalShowed && <AddWidgetModal onCancel={() => setModalShowed(false)} onConfirm={addWidget} />}

      {movingToastShowed && (
        <Toast
          content={
            <>
              <div>
                <div>Drag & Drop widgets to move them</div>
                <span
                  role="button"
                  className="link-minor underline"
                  onClick={() => publish(PubSubEvent.Moving, { stop: true })}
                >
                  I'm done moving
                </span>
              </div>
            </>
          }
          success
          onDismiss={() => setMovingToastShowed(false)}
        />
      )}

      {/* source: https://codepen.io/mattmarble/pen/qBdamQz */}
      {tabSettings?.effect === 'STARFIELD' && (
        <>
          <div id="stars"></div>
          <div id="stars2"></div>
          <div id="stars3"></div>
        </>
      )}

      {/* source: https://www.sliderrevolution.com/resources/css-animated-background/ */}
      {tabSettings?.effect === 'FIREFLY' && (
        <>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
          <div className="firefly"></div>
        </>
      )}
    </ProtectedPage>
  );
}
