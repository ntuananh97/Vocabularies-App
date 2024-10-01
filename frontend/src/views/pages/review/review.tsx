'use client';

import TopicModal from '@/components/Modals/TopicModal';
import {
  DATE_FORMAT,
  PAGE_SIZE,
  SORT_TYPE,
} from '@/configs/constants';
import { handleErrorResponse } from '@/helpers/response';
import { getWords } from '@/services/word';
import { TTopicType } from '@/types/topic';
import { TSearchWordParams, TWordSearchForm, TWordType } from '@/types/word';
import { Table, TableProps, Typography } from 'antd';
import dayjs from 'dayjs';
import React, { useCallback, useEffect, useState } from 'react';
import WordSearch from './WordSearch';
import debounce from 'lodash/debounce';
import { ENABLE_USE_REVIEW, SEARCH_WORD_FIELDS } from '@/configs/words';

interface IReviewProps {
  topicData: TTopicType;
}

const TIME_TO_SEARCH = 300; // ms

const { Title } = Typography;
const inititalTopicData = {} as TWordType;

const Review: React.FC<IReviewProps> = ({ topicData }) => {
  const topicId = topicData._id;

  const [isOpenTopicModal, setIsOpenTopicModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reviewWords, setReviewWords] = useState<TWordType[]>([]);

  const [editTopicData, setEditTopicData] =
    useState<TWordType>(inititalTopicData);
  const [pagination, setPagination] = useState<{
    current: number;
    total: number;
  }>({
    current: 1,
    total: 0,
  });

  const [filter, setFilter] = useState<TWordSearchForm>({} as TWordSearchForm);

  const [params, setParams] = useState<TSearchWordParams>({
    topicId,
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
      filter: JSON.stringify(newFilter),
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

  useEffect(() => {
    fetchData();

    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const openTopicModal = (item?: TWordType) => {
    console.log('Open topic modal');
    setIsOpenTopicModal(true);
    setEditTopicData(item || inititalTopicData);
  };


  const handleChangeFilter = (newFilter: TWordSearchForm) => {
    setFilter(newFilter);
    console.log('run handleChangeFilter:', newFilter);

    debouncedSearch(newFilter);
  };

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
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <Title level={2}>{topicData.name}</Title>
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

      {/* <TopicModal
        visible={isOpenTopicModal}
        onCancel={() => setIsOpenTopicModal(false)}
        editData={editTopicData}
      /> */}
    </div>
  );
};

export default Review;
