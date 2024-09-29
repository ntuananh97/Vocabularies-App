'use client'

import TopicModal from '@/components/Modals/TopicModal';
import useTopic from '@/hooks/useTopic'
import { useStore } from '@/store';
import { TTopicType } from '@/types/topic';
import { Button, List, Typography } from 'antd';
import React, { useEffect, useState } from 'react'

const { Title } = Typography;
const inititalTopicData = {} as TTopicType

const Topic = () => {
  const { getAllTopics, loading } = useTopic();
  const { topics } = useStore();

  const [isOpenTopicModal, setIsOpenTopicModal] = useState(false)
  const [editTopicData, setEditTopicData] = useState<TTopicType>(inititalTopicData)
  console.log("Topic ~ topics:", topics)


  const fetchData =  () => {
    getAllTopics()
  }


  useEffect( () => {
    fetchData()
  }, [])
  
  const openTopicModal = (item?: TTopicType) => {
    console.log('Open topic modal')
    setIsOpenTopicModal(true);
    setEditTopicData(item || inititalTopicData)
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <Title level={2}>List of Topics</Title>
        <Button type='primary' onClick={() => openTopicModal()}>Add topic</Button>
      </div>
      <List
        className="demo-loadmore-list"
        loading={loading}
        itemLayout="horizontal"
        // loadMore={loadMore}
        dataSource={topics}
        renderItem={(item) => (
          <List.Item
            key={item._id}
            actions={[<Button key="edit-action" onClick={() => openTopicModal(item)}>Edit</Button>]}
          >
            <List.Item.Meta title={item.name} />
          </List.Item>
        )}
      />

      <TopicModal visible={isOpenTopicModal} onCancel={() => setIsOpenTopicModal(false)} editData={editTopicData} />
    </div>
  );
}

export default Topic