
import React, { useState } from 'react';
import { 
  Card, 
  Tabs, 
  DatePicker, 
  Upload, 
  Button, 
  Input, 
  Table, 
  Alert, 
  Space, 
  Typography,
  message,
  Radio
} from 'antd';
import { 
  UploadOutlined, 
  SearchOutlined, 
  InfoCircleFilled,
  FolderOpenOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

const { Text, Title } = Typography;

const ValuationMaintenance: React.FC = () => {
  const [subTab, setSubTab] = useState('success');
  const [uploadMode, setUploadMode] = useState<'manual' | 'path'>('manual');

  const columns = [
    { title: '估值日期', dataIndex: 'date', key: 'date' },
    { title: '产品/策略名称', dataIndex: 'productName', key: 'productName' },
    { title: '单位净值', dataIndex: 'unitNetValue', key: 'unitNetValue', render: (val: number) => val?.toFixed(4) || '-' },
    { title: '市值(元)', dataIndex: 'marketValue', key: 'marketValue', render: (val: number) => val?.toLocaleString() || '-' },
  ];

  const mockData = [
    {
      key: '1',
      date: '2025-02-21',
      productName: '中银证券中国红-汇农鑫享1号',
      unitNetValue: 1.1245,
      marketValue: 12540000,
    },
    {
      key: '2',
      date: '2025-02-21',
      productName: '中银证券中国红-汇农鑫享1号',
      unitNetValue: 1.1248,
      marketValue: 12560000,
    }
  ];

  return (
    <div className="valuation-maintenance-container">
      <Card variant="borderless" styles={{ body: { padding: '24px' } }}>
        <div className="space-y-6">
          {/* Header Controls */}
          <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-8">
                <Space>
                  <Text strong>选择日期：</Text>
                  <DatePicker placeholder="选择日期" style={{ width: 180 }} />
                </Space>
                
                <Space>
                  <Text strong>上传方式：</Text>
                  <Radio.Group 
                    value={uploadMode} 
                    onChange={(e) => setUploadMode(e.target.value)}
                    optionType="button"
                    buttonStyle="solid"
                  >
                    <Radio.Button value="manual">手动上传</Radio.Button>
                    <Radio.Button value="path">路径读取</Radio.Button>
                  </Radio.Group>
                </Space>

                {uploadMode === 'manual' ? (
                  <Upload directory multiple showUploadList={false}>
                    <Button icon={<UploadOutlined />}>上传文件或文件夹</Button>
                  </Upload>
                ) : (
                  <Input 
                    placeholder="请输入或选择电脑文件夹路径" 
                    suffix={<FolderOpenOutlined className="cursor-pointer" onClick={() => message.info('正在打开文件浏览器...')} />} 
                    style={{ width: 320 }}
                  />
                )}

                <Button 
                  type="primary" 
                  icon={<SearchOutlined />} 
                  style={{ backgroundColor: '#FAAD14', borderColor: '#FAAD14' }}
                >
                  查询
                </Button>
              </div>
              
              <Text type="secondary" style={{ fontSize: '12px' }}>
                <InfoCircleFilled style={{ marginRight: 4, color: '#023D7F' }} />
                提示：{uploadMode === 'manual' ? '支持拖拽或批量选择估值表文件' : '选择文件路径后，系统将自动扫描并解析该路径下的所有估值文件'}
              </Text>
            </div>
          </div>

          {/* Sub Tabs */}
          <Tabs 
            activeKey={subTab} 
            onChange={setSubTab}
            className="valuation-sub-tabs"
            items={[
              { key: 'success', label: '解析成功数据' },
              { key: 'error', label: '解析失败数据' },
            ]}
          />

          {subTab === 'success' && (
            <div className="space-y-4">
              <Alert
                message={
                  <Space>
                    <InfoCircleFilled style={{ color: '#023D7F' }} />
                    <span>共识别成功 <Text strong style={{ color: '#023D7F' }}>201</Text> 个估值表</span>
                  </Space>
                }
                type="info"
                showIcon={false}
                style={{ backgroundColor: '#f0f7ff', border: '1px solid #adc6ff' }}
              />
              <Table 
                columns={columns} 
                dataSource={mockData} 
                pagination={{ pageSize: 10 }}
                size="middle"
                bordered={false}
                className="custom-valuation-table"
                scroll={{ x: 'max-content' }}
              />
            </div>
          )}
          
          {subTab === 'error' && (
            <div className="py-20 text-center text-gray-400">
              暂无解析失败数据
            </div>
          )}
        </div>
      </Card>

      <style>{`
        .valuation-sub-tabs .ant-tabs-nav {
          margin-bottom: 0;
        }
        .valuation-sub-tabs .ant-tabs-tab {
          font-size: 15px;
          padding: 12px 16px;
        }
        .custom-valuation-table .ant-table-thead > tr > th {
          background-color: #f5f7fa;
          color: #333;
          font-weight: 600;
        }
        .valuation-maintenance-container .ant-tabs-ink-bar {
          background-color: #023D7F;
        }
        .valuation-maintenance-container .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #023D7F;
        }
        .valuation-maintenance-container .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled) {
          background: #023D7F;
          border-color: #023D7F;
        }
        .valuation-maintenance-container .ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover {
          background: #002d5e;
          border-color: #002d5e;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default ValuationMaintenance;
