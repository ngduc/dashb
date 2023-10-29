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
    <div className="p-4">
      <div>Multiple Tabs is a part of Advanced Plan. Subscribe to get your Advanced Plan.</div>

      <div className="mt-4 flex flex-col items-center p-4 border-[1px] rounded-md text-black bg-gray-100">
        <form className="w-full lg:flex items-center" onSubmit={onSubmitSubscriber}>
          <div className="mr-2">Get your free premium account:</div>
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
    </div>
  );
}
