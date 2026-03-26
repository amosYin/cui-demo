
import React from 'react';
import { Row, Col, Card, Table, Typography, Space, Tabs, Tag, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { mockPerformanceAttribution, mockStockIndustry } from '../mockData';

const { Title, Text } = Typography;

const PerformanceAttribution: React.FC = () => {
  const renderTitle = (title: string, subTitle: string, description: string) => (
    <Space size={4}>
      <span>{title}</span>
      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: 4 }}>{subTitle}</Text>
      <Tooltip title={description}>
        <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: '14px', cursor: 'help' }} />
      </Tooltip>
    </Space>
  );
  // Major Asset Attribution Bar Option
  const getMajorAttributionOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['资产配置效应', '选券效应', '交互效应'], top: 0 },
    color: ['#023D7F', '#0066CC', '#4DA1FF'],
    grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: mockPerformanceAttribution.map(d => d.category) },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '资产配置效应', type: 'bar', stack: 'total', data: mockPerformanceAttribution.map(d => d.allocationEffect) },
      { name: '选券效应', type: 'bar', stack: 'total', data: mockPerformanceAttribution.map(d => d.selectionEffect) },
      { name: '交互效应', type: 'bar', stack: 'total', data: mockPerformanceAttribution.map(d => d.interactionEffect) }
    ]
  });

  // Stock Industry Bubble Chart Option
  const getStockBubbleOption = () => ({
    tooltip: { trigger: 'item', formatter: (params: any) => `${params.data[2]}<br/>配置效应: ${params.data[0]}%<br/>选股效应: ${params.data[1]}%` },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: { name: '行业配置效应(%)', splitLine: { lineStyle: { type: 'dashed' } } },
    yAxis: { name: '行业选股效应(%)', splitLine: { lineStyle: { type: 'dashed' } } },
    series: [
      {
        name: '行业归因',
        type: 'scatter',
        itemStyle: { color: '#023D7F', opacity: 0.7 },
        symbolSize: (data: any) => data[3] * 5,
        emphasis: { focus: 'self', label: { show: true, formatter: (params: any) => params.data[2], position: 'top' } },
        data: mockStockIndustry.map(d => [d.allocation, d.selection, d.industry, d.weight])
      }
    ]
  });

  const attributionColumns = [
    { title: '资产类别', dataIndex: 'category', key: 'category' },
    { title: '组合权重(%)', dataIndex: 'weight', key: 'weight', render: (val: number) => val.toFixed(2) },
    { title: '基准权重(%)', dataIndex: 'benchmarkWeight', key: 'benchmarkWeight', render: (val: number) => val.toFixed(2) },
    { title: '配置效应(%)', dataIndex: 'allocationEffect', key: 'allocationEffect', render: (val: number) => (
      <Text style={{ color: val >= 0 ? '#D50000' : '#00BFA5' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
    { title: '选券效应(%)', dataIndex: 'selectionEffect', key: 'selectionEffect', render: (val: number) => (
      <Text style={{ color: val >= 0 ? '#D50000' : '#00BFA5' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
    { title: '交互效应(%)', dataIndex: 'interactionEffect', key: 'interactionEffect', render: (val: number) => (
      <Text style={{ color: val >= 0 ? '#D50000' : '#00BFA5' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
    { title: '超额收益(%)', key: 'excess', render: (_: any, record: any) => {
      const total = record.allocationEffect + record.selectionEffect + record.interactionEffect;
      return <Text strong style={{ color: total >= 0 ? '#D50000' : '#00BFA5' }}>{total > 0 ? '+' : ''}{total.toFixed(2)}%</Text>;
    }}
  ];

  const attributionData = [
    { key: '1', category: '股票', weight: 45.2, benchmarkWeight: 40.0, allocationEffect: 0.45, selectionEffect: 1.2, interactionEffect: 0.1 },
    { key: '2', category: '债券', weight: 30.5, benchmarkWeight: 40.0, allocationEffect: 0.2, selectionEffect: 0.3, interactionEffect: -0.05 },
    { key: '3', category: '基金', weight: 10.1, benchmarkWeight: 10.0, allocationEffect: -0.1, selectionEffect: 0.5, interactionEffect: 0.02 },
    { key: '4', category: '现金', weight: 14.2, benchmarkWeight: 10.0, allocationEffect: 0.05, selectionEffect: 0, interactionEffect: 0 },
  ];

  const items = [
    {
      key: '1',
      label: '大类资产归因',
      children: (
        <div className="space-y-6">
          <Card title={renderTitle("大类资产超额收益分解", "Asset Class Excess Return Decomposition", "将组合超额收益分解为资产配置效应、选券效应和交互效应。")} bordered={false}>
            <ReactECharts option={getMajorAttributionOption()} style={{ height: 400 }} />
          </Card>
          <Card title={renderTitle("归因明细表", "Attribution Details Table", "提供各大类资产归因分析的详细数值，包括权重偏离和各效应贡献。")} bordered={false}>
            <Table columns={attributionColumns} dataSource={attributionData} pagination={false} />
          </Card>
        </div>
      ),
    },
    {
      key: '2',
      label: '股票行业归因',
      children: (
        <div className="space-y-6">
          <Card title={renderTitle("行业配置 vs 行业选股", "Industry Allocation vs Selection", "通过气泡图展示各行业的配置效应与选股效应，气泡大小代表行业权重。")} bordered={false}>
            <ReactECharts option={getStockBubbleOption()} style={{ height: 450 }} />
          </Card>
          <Card title={renderTitle("行业归因明细", "Industry Attribution Details", "提供各行业归因分析的详细贡献数据。")} bordered={false}>
            <Table 
              columns={[
                { title: '行业名称', dataIndex: 'industry', key: 'industry' },
                { title: '组合权重(%)', dataIndex: 'weight', key: 'weight' },
                { title: '配置贡献(%)', dataIndex: 'allocation', key: 'allocation', render: (val: number) => (
                  <Text style={{ color: val >= 0 ? '#D50000' : '#00BFA5' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
                )},
                { title: '选股贡献(%)', dataIndex: 'selection', key: 'selection', render: (val: number) => (
                  <Text style={{ color: val >= 0 ? '#D50000' : '#00BFA5' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
                )},
              ]} 
              dataSource={mockStockIndustry} 
              pagination={false} 
              size="small"
            />
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card bordered={false}>
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default PerformanceAttribution;
