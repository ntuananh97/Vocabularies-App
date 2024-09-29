'use client'

import useTopic from '@/hooks/useTopic'
import { useStore } from '@/store';
import { Button, List, Typography } from 'antd';
import React, { useEffect } from 'react'

const { Title } = Typography;

const Topic = () => {
  const { topics } = useStore();
  console.log("Topic ~ topics:", topics)

  const { getAllTopics, loading } = useTopic();

  const fetchData =  () => {
    getAllTopics()
  }


  useEffect( () => {
    fetchData()
  }, [])
  

  return (
    <div>
      <Title level={2}>List of Topics</Title>
      <List
      className="demo-loadmore-list"
      loading={loading}
      itemLayout="horizontal"
      // loadMore={loadMore}
      dataSource={topics}
      renderItem={(item) => (
        <List.Item
          key={item._id}
          actions={[<Button key="edit-action">Edit</Button>]}
        >
          <List.Item.Meta
              title={item.name}
            />
        </List.Item>
      )}
    />
    </div>
  )
}

export default Topic