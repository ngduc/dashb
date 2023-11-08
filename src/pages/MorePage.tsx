import React, { useState } from 'react';
import { apiPost } from '../utils/apiUtils';

export default function MorePage(props: any) {
  const [email, setEmail] = useState('');

  const onSubmitSubscriber = async (event: any) => {
    event.preventDefault();
    if (email) {
      // (window as any).gtag('event', 'subscribe', { label: email, email });
      // (window as any).gtag('event', 'CustomSubscribeEvent', { label: email, email });
      // (window as any).gtag('event', 'click', {
      //   event_category: 'subscribe',
      //   event_label: email
      // });
      console.log('Subscribed: ', email);
      apiPost(`/api/user/subscribe`, { payload: { email } });
    }
    alert(email.trim() ? 'Thank you for subscribing to Dashb.' : 'Please enter your email.');
  };

  return (
    <div className="p-4 text-center">
      <div>Dashb is currently free. Multiple Tabs will be a part of Advanced Plan, including more widgets.</div>
      <div>Subscribe to get your Advanced Plan.</div>

      <div className="mt-4 flex flex-col items-center p-4 text-black bg-gray-100">
        <form className="w-full lg:flex items-center justify-center" onSubmit={onSubmitSubscriber}>
          <span className="mr-2">Get your Advanced Plan:</span>
          <input
            placeholder="youremail@example.com"
            className="border-2 rounded-md mr-2 px-2 py-1 w-60 text-white"
            type="email"
            required
            onChange={(ev) => {
              setEmail(ev.target.value);
            }}
          />
          <button
            type="submit"
            className="py-1 px-4 disabled:bg-gray-500 disabled:cursor-not-allowed bg-blue-200 hover:bg-blue-300 text-gray-800 rounded-md mt-2 lg:mt-0"
          >{`Submit`}</button>
        </form>
      </div>

      <hr className="mt-8 border-gray-300" />

      <div className="mt-8 flex flex-col gap-8">
        <div className="text-xl">
          <b className="text-teal-100 mr-2">FREE Plan</b> Below are some examples of Dashboards
        </div>

        <div className="flex flex-col items-center justify-center">
          <div>Dashboard with TODO notes, Weather, Air Quality, Stock index, News, Lofi music player</div>
          <img
            src="/dashb-example-01.png"
            className="rounded-lg max-w-[95vw] lg:max-w-[50vw] border-2 border-gray-200 mt-2"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div>Dashboard to monior Stock prices, Trading notes</div>
          <img
            src="/dashb-example-02.png"
            className="rounded-lg max-w-[95vw] lg:max-w-[50vw] border-2 border-gray-200 mt-2"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div>Dashboard with different News sources</div>
          <img
            src="/dashb-example-03.png"
            className="rounded-lg max-w-[95vw] lg:max-w-[50vw] border-2 border-gray-200 mt-2"
          />
        </div>

        <div className="flex flex-col items-center justify-center">
          <div>
            Use as a Personal Dashboard on different devices (for morning routines, quick glance of information)
          </div>
          <img
            src="/demo-screens-01.jpg"
            className="rounded-lg max-w-[95vw] lg:max-w-[50vw] border-2 border-gray-200 mt-2"
          />
        </div>
      </div>
    </div>
  );
}
