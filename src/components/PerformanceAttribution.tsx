
import React from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Space, Tooltip, Tabs } from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  QuestionCircleOutlined,
  RiseOutlined,
  FallOutlined,
  BarChartOutlined,
  DatabaseOutlined
} from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { mockPerformanceAttribution } from '../mockData';

const { Text } = Typography;

const PerformanceAttribution: React.FC = () => {
  const renderTitle = (title: string, description: string) => (
    <Space size={4}>
      <span>{title}</span>
      <Tooltip title={description}>
        <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: '14px', cursor: 'help' }} />
      </Tooltip>
    </Space>
  );

  // Performance Trend Chart Option (Simplified: No Benchmark)
  const getPerformanceTrendOption = () => {
    const startDate = dayjs('2019-08-05');
    const endDate = dayjs('2024-03-13');
    const days = endDate.diff(startDate, 'day');
    const chartDates = [];
    const productData = [];

    let currentProduct = 1.0;

    for (let i = 0; i <= days; i += 7) {
      const date = startDate.add(i, 'day').format('YYYY-MM-DD');
      chartDates.push(date);
      const pRand = (Math.random() - 0.48) * 0.02;
      currentProduct *= (1 + pRand);
      productData.push(currentProduct.toFixed(4));
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: { 
        data: ['安联测试产品1'],
        bottom: 0,
        icon: 'roundRect'
      },
      grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
      xAxis: {
        type: 'category',
        data: chartDates,
        axisLabel: { 
          interval: Math.floor(chartDates.length / 8),
          fontSize: 10,
          color: '#8c8c8c'
        },
        axisLine: { lineStyle: { color: '#f0f0f0' } }
      },
      yAxis: { 
        type: 'value', 
        min: 0.9, 
        max: 1.6, 
        interval: 0.1,
        axisLabel: { color: '#8c8c8c' },
        splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
      },
      series: [
        {
          name: '安联测试产品1',
          type: 'line',
          data: productData,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#4ECBEE' },
          lineStyle: { width: 2 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(78, 203, 238, 0.3)' },
                { offset: 1, color: 'rgba(78, 203, 238, 0)' }
              ]
            }
          }
        }
      ]
    };
  };

  // Asset Return Contribution Bar Option
  const getReturnContributionOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['收益贡献'], top: 0 },
    color: ['#4ECBEE'],
    grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: attributionData.map(d => d.category) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { 
        name: '收益贡献', 
        type: 'bar', 
        barWidth: '40%',
        data: attributionData.map(d => d.contribution),
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: (params: any) => params.value >= 0 ? '#BC4736' : '#4ECBEE'
        },
        label: { show: true, position: 'top', formatter: '{c}%' }
      }
    ]
  });

  const performanceTableColumns = [
    { title: '绩效指标', dataIndex: 'metric', key: 'metric', className: 'bg-gray-50 font-medium' },
    { title: '安联测试产品1', dataIndex: 'product', key: 'product', align: 'center' as const },
  ];

  const performanceTableData = [
    { key: '1', metric: '累计收益率', product: '20.01%' },
    { key: '2', metric: '年化收益', product: '4.19%' },
    { key: '3', metric: '波动率', product: '11.55%' },
    { key: '4', metric: '夏普率', product: '0.2849' },
    { key: '5', metric: '最大回撤', product: '-28.26%' },
    { key: '6', metric: '卡玛比率', product: '0.1483' },
  ];

  const attributionColumns = [
    { title: '资产类别', dataIndex: 'category', key: 'category' },
    { title: '区间收益率(%)', dataIndex: 'return', key: 'return', render: (val: number) => (
      <Text style={{ color: val >= 0 ? '#BC4736' : '#4ECBEE' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
    { title: '收益贡献(%)', dataIndex: 'contribution', key: 'contribution', render: (val: number) => (
      <Text strong style={{ color: val >= 0 ? '#BC4736' : '#4ECBEE' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
  ];

  const attributionData = [
    { key: '1', category: '股票', weight: 45.2, return: 3.87, contribution: 1.75 },
    { key: '2', category: '债券', weight: 30.5, return: 1.48, contribution: 0.45 },
    { key: '3', category: '基金', weight: 10.1, return: 4.15, contribution: 0.42 },
    { key: '4', category: '现金', weight: 14.2, return: 0.56, contribution: 0.08 },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title={
                <Space>
                  <DatabaseOutlined style={{ color: '#023D7F' }} />
                  <span>单位净值 (2026年3月9日)</span>
                </Space>
              } 
              value={1.1245} 
              precision={4} 
              styles={{ content: { color: '#023D7F' } }} 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title={
                <Space>
                  <RiseOutlined style={{ color: '#BC4736' }} />
                  <span>日收益率</span>
                </Space>
              } 
              value={0.85} 
              precision={2} 
              styles={{ content: { color: '#BC4736' } }} 
              prefix={<ArrowUpOutlined />} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title={
                <Space>
                  <BarChartOutlined style={{ color: '#BC4736' }} />
                  <span>成立以来收益率</span>
                </Space>
              } 
              value={12.45} 
              precision={2} 
              styles={{ content: { color: '#BC4736' } }} 
              prefix={<ArrowUpOutlined />} 
              suffix="%" 
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic 
              title={
                <Space>
                  <FallOutlined style={{ color: '#4ECBEE' }} />
                  <span>成立以来最大回撤</span>
                </Space>
              } 
              value={-4.2} 
              precision={2} 
              styles={{ content: { color: '#4ECBEE' } }} 
              suffix="%" 
            />
          </Card>
        </Col>
      </Row>

      {/* Performance Trend Section */}
      <Card title={renderTitle("业绩走势", "展示产品累计收益率随时间的变化趋势。")} variant="borderless">
        <Row gutter={24}>
          <Col span={16}>
            <ReactECharts option={getPerformanceTrendOption()} style={{ height: 400 }} />
          </Col>
          <Col span={8}>
            <div className="h-full flex flex-col justify-center overflow-x-auto">
              <Table
                columns={performanceTableColumns}
                dataSource={performanceTableData}
                pagination={false}
                size="small"
                bordered
                className="performance-table"
                scroll={{ x: 'max-content' }}
              />
            </div>
          </Col>
        </Row>
      </Card>

      {/* Attribution Section */}
      <Tabs 
        defaultActiveKey="1" 
        items={[
          {
            key: '1',
            label: '资产收益贡献',
            children: (
              <div className="space-y-6">
                <Card title={renderTitle("资产收益贡献分解", "将产品总收益拆解为各大类资产的贡献。")} variant="borderless">
                  <ReactECharts option={getReturnContributionOption()} style={{ height: 400 }} />
                </Card>
                <Card title={renderTitle("收益贡献明细表", "提供各大类资产收益贡献的详细数值。")} variant="borderless">
                  <Table columns={attributionColumns} dataSource={attributionData} pagination={false} scroll={{ x: 'max-content' }} />
                </Card>
              </div>
            ),
          }
        ]} 
      />
    </div>
  );
};

export default PerformanceAttribution;

