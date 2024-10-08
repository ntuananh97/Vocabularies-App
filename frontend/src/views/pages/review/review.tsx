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
import { Button, Switch, Table, TableProps, Tooltip, Typography } from 'antd';
import {
  EditOutlined,
  CheckOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import WordSearch from './WordSearch';
import { ENABLE_USE_REVIEW, UN_ENABLE_USE_REVIEW } from '@/configs/words';
import SpeakTextWrapper from '@/components/SpeakTextWrapper';
import MoreAction from './MoreAction';
import WordInfoModal from '@/components/Modals/WordModal/WordInfoModal';

interface IReviewProps {
  topicData: TTopicType;
}

const { Title } = Typography;
export const initialEditWordData = {} as TWordType;

const Review: React.FC<IReviewProps> = ({ topicData }) => {
  const topicId = topicData._id;

  const [isOpenWordModal, setIsOpenWordModal] = useState(false);
  const [isOpenWordInfoModal, setIsOpenWordInfoModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewWords, setReviewWords] = useState<TWordType[]>([]);

  const [editTopicData, setEditTopicData] =
    useState<TWordType>(initialEditWordData);
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
    sort: JSON.stringify({ reviewCount: SORT_TYPE.ASC, updatedAt: SORT_TYPE.DESC }),
  });


  const fetchData = async (searchParams?: TSearchWordParams) => {
    setLoading(true);

    const newFilter = searchParams?.filter || filter;
    const newUseReviewToday = searchParams?.useReviewToday || params.useReviewToday;
    const newPage = searchParams?.page || params.page;
    const newPageSize = searchParams?.pageSize || params.pageSize;
    const newSort = searchParams?.sort || params.sort;

    // remove empty fields
    Object.keys(newFilter).forEach((key) => {
      const typedKey = key as keyof TWordSearchForm;

      let value = newFilter[typedKey];

      const isNotValue = !value;
      const isNotValueButValueIs0 = isNotValue && value !== 0;

      if (isNotValue && isNotValueButValueIs0)  delete newFilter[typedKey];
    });

    const newParams = {
      page: newPage,
      pageSize: newPageSize,
      sort: newSort,
      filter: JSON.stringify({
        ...newFilter,
        topicId,
      }),
      useReviewToday: newUseReviewToday,
    };

    if (newUseReviewToday !== ENABLE_USE_REVIEW) delete newParams.useReviewToday;

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


  const handleFetchData = () => {
    fetchData();
  }

  useEffect(() => {
    handleFetchData();
  }, []);


  const openWordModal = (item?: TWordType) => {
    setIsOpenWordModal(true);
    setEditTopicData(item || initialEditWordData);
  };

  const openWordInfoModal = (item?: TWordType) => {
    setIsOpenWordInfoModal(true);
    setEditTopicData(item || initialEditWordData);
  };


  const handleChangeFilter = (newFilter: TWordSearchForm) => {
    fetchData({ filter: newFilter });
    setFilter(newFilter);
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

  const showReviewWordsOrAllWords = (checked: boolean) => {
    if (loading) return;

    const newUseReviewToday = checked ? ENABLE_USE_REVIEW : UN_ENABLE_USE_REVIEW;
    setParams({
      ...params,
      useReviewToday: newUseReviewToday,
    });

    fetchData({useReviewToday: newUseReviewToday});
  }

  const checked = params.useReviewToday === ENABLE_USE_REVIEW;

  const columns: TableProps<TWordType>['columns'] = [
    {
      title: <div>Sentence Hello</div>,
      dataIndex: 'title',
      key: 'title',
      render: (text, item) => <SpeakTextWrapper text={text} className='justify-between'>
      <Button onClick={() => openWordInfoModal(item)} type="text">{text}</Button>
    </SpeakTextWrapper>,
    },
    {
      title: 'Word',
      dataIndex: 'keyWord',
      key: 'keyWord',
      render: (text) => <SpeakTextWrapper text={text} className='justify-between' />,

    },

    {
      title: 'Pronunciation',
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
          <MoreAction />
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-3">
        <div className='flex items-center gap-2'>
          <Title style={{marginBottom: 0}} level={2}>{topicData.name}</Title>

          <div className='flex items-center gap-1'>
            <Switch onChange={showReviewWordsOrAllWords} checked={checked} />
            <span>{checked ? 'Words to review today' : 'All words'}</span>
          </div>
        </div>
        <Button type='primary' onClick={() => openWordModal()}>Add Word</Button>
      </div>

      <div className="mb-5">
        <WordSearch searchWordParamsFromParent={params}  filter={filter} onChangeFilter={handleChangeFilter} />
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
      <WordInfoModal
        visible={isOpenWordInfoModal}
        onCancel={() => setIsOpenWordInfoModal(false)}
        editData={editTopicData}
      />
    </div>
  );
};

export default Review;
