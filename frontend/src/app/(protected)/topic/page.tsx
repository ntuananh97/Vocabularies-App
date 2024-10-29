import React from 'react';
import { Metadata } from 'next';
import Topic from '@/views/pages/topic';
import { REVIEW_TOPIC_TYPES } from '@/views/pages/topic/constants';

export const metadata: Metadata = {
  title: 'Topic',
}

const TopicPage = async () => {

  return <Topic type={REVIEW_TOPIC_TYPES.REVIEW} />;
};

export default TopicPage;
