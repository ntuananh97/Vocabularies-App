'use client';

import WordModal from '@/components/Modals/WordModal';
import {
  DATE_FORMAT,
  PAGE_SIZE,
  SORT_TYPE,
} from '@/configs/constants';
import { handleErrorResponse, handleSuccessResponse } from '@/helpers/response';
import { getWords, markWordAsReviewed } from '@/services/word';
import { TTopicType } from '@/types/topic';
import { TSearchWordParams, TWordSearchForm, TWordType } from '@/types/word';
import { Button, Table, TableProps, Tooltip, Typography } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import WordSearch from './WordSearch';
import debounce from 'lodash/debounce';
import { ENABLE_USE_REVIEW, SEARCH_WORD_FIELDS } from '@/configs/words';

interface IReviewProps {
  topicData: TTopicType;
}

const TIME_TO_SEARCH = 300; // ms

const { Title } = Typography;
const inititalEditData = {} as TWordType;

const Review: React.FC<IReviewProps> = ({ topicData }) => {
  const topicId = topicData._id;

  const [isOpenWordModal, setIsOpenWordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewWords, setReviewWords] = useState<TWordType[]>([]);

  const [editTopicData, setEditTopicData] =
    useState<TWordType>(inititalEditData);
  const [pagination, setPagination] = useState<{
    current: number;
    total: number;
  }>({
    current: 1,
    total: 0,
  });

  const [filter, setFilter] = useState<TWordSearchForm>({} as TWordSearchForm);

  const [params, setParams] = useState<TSearchWordParams>({
    useReviewToday: ENABLE_USE_REVIEW,
    page: 1,
    pageSize: PAGE_SIZE,
    sort: JSON.stringify({ reviewCount: SORT_TYPE.ASC }),
  });


  const fetchData = async (searchParams?: TSearchWordParams) => {
    setLoading(true);

    const newFilter = searchParams?.filter || filter;

    // remove empty fields
    Object.keys(newFilter).forEach((key) => {
      const typedKey = key as keyof TWordSearchForm;

      let value = newFilter[typedKey];

      const isNotValue = !value;
      const isNotValueButValueIs0 = isNotValue && value !== 0;

      if (isNotValue && isNotValueButValueIs0)  delete newFilter[typedKey];
    });

    const newParams = {
      ...params,
      filter: JSON.stringify({
        ...newFilter,
        topicId,
      }),
    };

    try {
      const response = await getWords(newParams);
      const { list, totalCount } = response.data;
      setReviewWords(list);
      setPagination({ ...pagination, total: totalCount });
    } catch (error) {
      handleErrorResponse(error);
    }

    setLoading(false);
  };

  const debouncedSearch = React.useRef(
    debounce(async (newFilter: TWordSearchForm) => {
      fetchData({
        filter: newFilter
      });
    }, TIME_TO_SEARCH)
  ).current;

  const handleFetchData = () => {
    fetchData();
  }

  useEffect(() => {
    handleFetchData();

    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const openWordModal = (item?: TWordType) => {
    setIsOpenWordModal(true);
    setEditTopicData(item || inititalEditData);
  };


  const handleChangeFilter = (newFilter: TWordSearchForm) => {
    setFilter(newFilter);
    console.log('run handleChangeFilter:', newFilter);

    debouncedSearch(newFilter);
  };

  const handleReview = async (wordId: string) => {
    try {
      await markWordAsReviewed(wordId);
      handleSuccessResponse('Word marked as reviewed');
      handleFetchData();
    } catch (error) {
      handleErrorResponse(error);
    }
  }

  const columns: TableProps<TWordType>['columns'] = [
    {
      title: <div>Sentence Hello</div>,
      dataIndex: 'title',
      key: 'title',
      // render: (text) => <a>{text}</a>,
    },
    {
      title: 'Word',
      dataIndex: 'keyWord',
      key: 'keyWord',
    },

    {
      title: 'Pronounciation',
      dataIndex: 'pronounciation',
      key: 'pronounciation',
    },
    {
      title: 'Definition',
      dataIndex: 'definition',
      key: 'definition',
    },
    {
      title: 'Review Count',
      dataIndex: 'reviewCount',
      key: 'reviewCount',
    },
    {
      title: 'Last Review Date',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (val) => dayjs(val).format(DATE_FORMAT),
    },
    {
      key: 'action',
      render: (_, record) => (
        <div className='flex items-center gap-1'>
          <Tooltip title="Edit">
            <Button onClick={() => openWordModal(record)} type='text' icon={<EditOutlined />} />
          </Tooltip>
          <Tooltip title="Review">
            <Button onClick={() => handleReview(record._id)} type='text' icon={<CheckOutlined />} />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <Title level={2}>{topicData.name}</Title>
        <Button type='primary' onClick={() => openWordModal()}>Add Word</Button>
      </div>

      <div className="mb-5">
        <WordSearch filter={filter} onChangeFilter={handleChangeFilter} />
      </div>

      <Table<TWordType>
        columns={columns}
        dataSource={reviewWords}
        rowKey="_id"
        loading={loading}
      />

      <WordModal
        visible={isOpenWordModal}
        onCancel={() => setIsOpenWordModal(false)}
        editData={editTopicData}
        onRefreshData={handleFetchData}
        topicId={topicId}
      />
    </div>
  );
};

export default Review;
