import { Button, Col, DatePicker, Drawer, Input, InputNumber, InputNumberProps, Row } from 'antd';
import React, { useCallback, useEffect, useId, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { TSearchWordParams, TWordSearchForm } from '@/types/word';
import SearchComponent from './SearchComponent';
import PeriodSelect from '@/components/Selects/PeriodSelect';
import LessonSelect from '@/components/Selects/LessonSelect';
import { SEARCH_WORD_FIELDS } from '@/configs/words';
import dayjs, { Dayjs } from 'dayjs';
import debounce from 'lodash/debounce';

interface IWordSearchProps {
  onChangeFilter: (_filter: TWordSearchForm) => void;
  filter: TWordSearchForm;
  searchWordParamsFromParent: TSearchWordParams;
}

const TIME_TO_SEARCH = 300; // ms

const { RangePicker } = DatePicker;

const WordSearch: React.FC<IWordSearchProps> = ({ filter, searchWordParamsFromParent , onChangeFilter }) => {
  const [open, setOpen] = useState(false);
  const unique = useId();

  const getUniqueId = (key: string) => `${key}-${unique}`;

  const debouncedSearch = useCallback(
    debounce(async (newFilter: TWordSearchForm) => {
      onChangeFilter(newFilter);
        }, TIME_TO_SEARCH), 
    [searchWordParamsFromParent]
  );

  useEffect(() => {
    // Cleanup the debounce when component unmounts
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch])

  const handleChangeFilterInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: string
  ) => {
    const changeValue = { ...filter, [key]: e.target.value };
    debouncedSearch(changeValue);
  };

  const handleChangeRiewCount: InputNumberProps['onChange'] = (val) => {
    const valWithType = val as TWordSearchForm['reviewCount']
    const changeValue = { ...filter, reviewCount: valWithType };
    debouncedSearch(changeValue);
  }

  const handleChangeSelect = (val: string, key: string) => {
    const changeValue = { ...filter, [key]: val };
    debouncedSearch(changeValue);
  }

  const handleChangeRangePicker = (dates: null | (Dayjs | null)[], key: string) => {
    let dateData = dates?.[0] ? dayjs(dates?.[0]).startOf('day').toISOString() : "";

    if (dates?.[1]) {
      dateData += `,${dayjs(dates?.[1]).endOf('day').toISOString()}`;
    }
    const changeValue = { ...filter, [key]: dateData };
    onChangeFilter(changeValue);
  }

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Row gutter={15}>
        <Col span={7}>
          <Input
            onChange={(e) => handleChangeFilterInput(e, SEARCH_WORD_FIELDS.KEY_WORD)}
            placeholder="Seach word"
          />
        </Col>
        <Col span={7}>
          <Input
            onChange={(e) => handleChangeFilterInput(e, SEARCH_WORD_FIELDS.DEFINITION)}
            placeholder="Search definition"
          />
        </Col>
        <Col span={7}>
          <RangePicker
            className="w-full"
            placeholder={['Start date', 'End Date']}
            onChange={(value) => handleChangeRangePicker(value, SEARCH_WORD_FIELDS.CREATED_AT)}
          />
        </Col>
        <Col span={3}>
          <Button
            onClick={showDrawer}
            type="primary"
            className="w-full"
            icon={<PlusOutlined />}
          >
            Other
          </Button>
        </Col>
      </Row>
      <Drawer title="Basic Drawer" onClose={onClose} open={open}>
        <SearchComponent label="Số lần review" labelFor={getUniqueId('word-review-count-search-id')}>
          <InputNumber<number>
            id={getUniqueId('word-review-count-search-id')}
            onChange={handleChangeRiewCount}
            className="w-full"
            style={{ width: '100%' }}
            // reviewCount
          />
        </SearchComponent>
        <SearchComponent label="Câu" labelFor={getUniqueId('word-sentence-search-id')}>
          <Input
            id={getUniqueId('word-sentence-search-id')}
            onChange={(e) => handleChangeFilterInput(e, SEARCH_WORD_FIELDS.TITLE)}
            className="w-full"
          />
        </SearchComponent>
        <SearchComponent label="Mốc thời gian" labelFor={getUniqueId('word-period-search-id')}>
          <PeriodSelect
            id={getUniqueId('word-period-search-id')}
            className="w-full"
            onChange={(value) =>handleChangeSelect(value, SEARCH_WORD_FIELDS.STEP)}
            allowClear
          />
        </SearchComponent>
        <SearchComponent label="Nhóm từ" labelFor={getUniqueId('word-sentence-search-id')}>
        <LessonSelect
            id={getUniqueId('word-lesson-search-id')}
            className="w-full"
            onChange={(value) =>handleChangeSelect(value, SEARCH_WORD_FIELDS.LESSON_ID)}
            allowClear
          />
        </SearchComponent>
      </Drawer>
    </>
  );
};

export default React.memo(WordSearch);
