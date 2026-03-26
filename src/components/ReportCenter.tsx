
import React from 'react';
import { Row, Col, Card, Button, Typography, Space, List, Tag, Modal, Empty } from 'antd';
import { FilePdfOutlined, FileExcelOutlined, EyeOutlined, DownloadOutlined, MailOutlined } from '@ant-design/icons';
import { mockReports } from '../mockData';

const { Title, Text } = Typography;

const ReportCenter: React.FC = () => {
  const [previewVisible, setPreviewVisible] = React.useState(false);
  const [currentReport, setCurrentReport] = React.useState<any>(null);

  const handlePreview = (report: any) => {
    setCurrentReport(report);
    setPreviewVisible(true);
  };

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="报告模板" bordered={false}>
            <Row gutter={[16, 16]}>
              {['日报', '周报', '月报', '季报'].map(type => (
                <Col span={6} key={type}>
                  <Card hoverable className="text-center py-6 border-dashed border-2">
                    <FilePdfOutlined style={{ fontSize: 48, color: '#023D7F', marginBottom: 16 }} />
                    <Title level={5}>{type}模板</Title>
                    <Text type="secondary">包含净值、配置、归因、风险</Text>
                    <div className="mt-4">
                      <Button type="primary" ghost size="small">生成报告</Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card 
            title="历史报告记录" 
            bordered={false}
            extra={<Button type="link">查看更多</Button>}
          >
            <List
              itemLayout="horizontal"
              dataSource={mockReports}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button key="preview" icon={<EyeOutlined />} onClick={() => handlePreview(item)}>预览</Button>,
                    <Button key="download" icon={<DownloadOutlined />}>导出</Button>,
                    <Button key="mail" icon={<MailOutlined />}>发送邮件</Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={<FilePdfOutlined style={{ fontSize: 32, color: '#D50000' }} />}
                    title={<Text strong>{item.title}</Text>}
                    description={
                      <Space>
                        <Tag color="#023D7F">{item.type}</Tag>
                        <Text type="secondary">生成时间：{item.date} 09:00</Text>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title={currentReport?.title || '报告预览'}
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="excel" icon={<FileExcelOutlined />}>导出 Excel</Button>,
          <Button key="pdf" type="primary" icon={<FilePdfOutlined />}>导出 PDF</Button>,
        ]}
        width={1000}
      >
        <div className="bg-gray-100 p-8 min-h-[600px] flex flex-col items-center justify-center border rounded">
          <Empty 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
            description={
              <div className="text-center">
                <Title level={4}>报告预览区域</Title>
                <Text type="secondary">此处将渲染 PDF 预览内容，包含：</Text>
                <ul className="list-disc text-left inline-block mt-4">
                  <li>净值走势图表</li>
                  <li>资产配置环形图</li>
                  <li>业绩归因明细表</li>
                  <li>风险指标仪表盘</li>
                </ul>
              </div>
            } 
          />
        </div>
      </Modal>
    </div>
  );
};

export default ReportCenter;
