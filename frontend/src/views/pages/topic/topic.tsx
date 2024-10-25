'use client'

import NavLink from '@/app/nav-link';
import TopicModal from '@/components/Modals/TopicModal';
import PageContentLayout from '@/components/PageContentLayout';
import { ROUTE_CONFIG } from '@/configs/route';
import useTopic from '@/hooks/useTopic'
import { useStore } from '@/store';
import { TTopicType } from '@/types/topic';
import { Button, List } from 'antd';
import React, { useEffect, useState } from 'react'
import { REVIEW_TOPICS_BREADCRUMB } from './constants';

const inititalTopicData = {} as TTopicType

const Topic = () => {
  const { getAllTopics, loading } = useTopic();
  const { topics } = useStore();

  const [isOpenTopicModal, setIsOpenTopicModal] = useState(false)
  const [editTopicData, setEditTopicData] = useState<TTopicType>(inititalTopicData)


  const fetchData =  () => {
    getAllTopics()
  }


  useEffect( () => {
    fetchData()
  }, [])

  const openTopicModal = (item?: TTopicType) => {
    setIsOpenTopicModal(true);
    setEditTopicData(item || inititalTopicData)
  }

  return (
    <>
      <PageContentLayout
        title="Review Topics"
        action={
          <Button type="primary" onClick={() => openTopicModal()}>
            Add topic
          </Button>
        }
        breadCrumbItems={[{title: REVIEW_TOPICS_BREADCRUMB}]}
      >
        <List
          className="demo-loadmore-list"
          loading={loading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          dataSource={topics}
          renderItem={(item) => (
            <List.Item
              key={item._id}
              actions={[
                <Button key="edit-action" onClick={() => openTopicModal(item)}>
                  Edit
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <NavLink href={`${ROUTE_CONFIG.TOPIC}/${item._id}`}>
                    {item.name}
                  </NavLink>
                }
              />
            </List.Item>
          )}
        />
      </PageContentLayout>
      <TopicModal
        visible={isOpenTopicModal}
        onCancel={() => setIsOpenTopicModal(false)}
        editData={editTopicData}
      />
    </>
  );
}

export default Topic
