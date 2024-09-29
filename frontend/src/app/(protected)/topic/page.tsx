import React from 'react';
import { Metadata } from 'next';
import Topic from '@/views/pages/topic';

export const metadata: Metadata = {
  title: 'Topic',
}

const TopicPage = async () => {

  return <Topic />;
};

export default TopicPage;
