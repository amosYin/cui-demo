
import React from 'react';
import { Row, Col, Card, Table, Typography, Space, Tabs, Tag } from 'antd';
import ReactECharts from 'echarts-for-react';
import { mockPerformanceAttribution, mockStockIndustry } from '../mockData';

const { Title, Text } = Typography;

const PerformanceAttribution: React.FC = () => {
  // Major Asset Attribution Bar Option
  const getMajorAttributionOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['资产配置效应', '选券效应', '交互效应'] },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
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
      <Text type={val >= 0 ? 'danger' : 'success'}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
    { title: '选券效应(%)', dataIndex: 'selectionEffect', key: 'selectionEffect', render: (val: number) => (
      <Text type={val >= 0 ? 'danger' : 'success'}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
    { title: '交互效应(%)', dataIndex: 'interactionEffect', key: 'interactionEffect', render: (val: number) => (
      <Text type={val >= 0 ? 'danger' : 'success'}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )},
    { title: '超额收益(%)', key: 'excess', render: (_: any, record: any) => {
      const total = record.allocationEffect + record.selectionEffect + record.interactionEffect;
      return <Text strong type={total >= 0 ? 'danger' : 'success'}>{total > 0 ? '+' : ''}{total.toFixed(2)}%</Text>;
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
          <Card title="大类资产超额收益分解" bordered={false}>
            <ReactECharts option={getMajorAttributionOption()} style={{ height: 400 }} />
          </Card>
          <Card title="归因明细表" bordered={false}>
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
          <Card title="行业配置 vs 行业选股 (气泡大小=行业权重)" bordered={false}>
            <ReactECharts option={getStockBubbleOption()} style={{ height: 450 }} />
          </Card>
          <Card title="行业归因明细" bordered={false}>
            <Table 
              columns={[
                { title: '行业名称', dataIndex: 'industry', key: 'industry' },
                { title: '组合权重(%)', dataIndex: 'weight', key: 'weight' },
                { title: '配置贡献(%)', dataIndex: 'allocation', key: 'allocation', render: (val: number) => (
                  <Text type={val >= 0 ? 'danger' : 'success'}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
                )},
                { title: '选股贡献(%)', dataIndex: 'selection', key: 'selection', render: (val: number) => (
                  <Text type={val >= 0 ? 'danger' : 'success'}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
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
