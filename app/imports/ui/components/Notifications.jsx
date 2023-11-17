/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';

import { ToastContainer, toast, Slide, Zoom, Flip, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const outages = ['[RESOLVED] Online leave (https://www.hawaii.edu/leave) is unavailable (Nov 15)'];
const alerts = ['Security Alert: Multiple security vulnerabilities in the SoftEther VPN client'];
const mait = ['Scheduled Maintenance for apply.hawaii.edu (Jan 20)'];
const notices = ['Notice: End of support for macOS 11 (Big Sur)'];

const Notifications = () => {
  /* Sample toast calls
    toast.success('success');
    toast.info('info');
    toast.warn('warn');
    toast.error('error'); */

  useEffect(() => {
    notices.forEach((item) => {
      toast.info(item);
    });
    mait.forEach((item) => {
      toast.warn(item);
    });
    outages.forEach((item) => {
      toast.warn(item);
    });
    alerts.forEach((item) => {
      toast.error(item);
    });
  }, []);

  /* Renders toast notifcations for landing page */
  return (
    <ToastContainer
      position="bottom-right"
      transition={Slide}
      autoClose={false}
      draggable={false}
      theme="colored"
    />
  );
};

export default Notifications;
