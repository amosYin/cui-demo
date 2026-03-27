
import React from 'react';
import { Row, Col, Card, Table, Typography, Space, Tabs, Tag, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { mockAssetAllocation, mockBondTypes, mockStockIndustry } from '../mockData';

const { Title, Text } = Typography;

const AssetAllocation: React.FC = () => {
  const renderTitle = (title: string, description: string) => (
    <Space size={4}>
      <span>{title}</span>
      <Tooltip title={description}>
        <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: '14px', cursor: 'help' }} />
      </Tooltip>
    </Space>
  );
  // Major Asset Allocation Area Chart Option
  const getMajorAllocationOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } } },
    legend: { data: ['现金', '股票', '债券', '基金'], top: 0 },
    color: ['#00BFA5', '#023D7F', '#0066CC', '#4DA1FF'],
    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
    xAxis: { type: 'category', boundaryGap: false, data: ['2025-12', '2026-01', '2026-02', '2026-03'] },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      { name: '现金', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [10, 12, 15, 15] },
      { name: '股票', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [40, 45, 42, 45] },
      { name: '债券', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [40, 35, 33, 30] },
      { name: '基金', type: 'line', stack: 'Total', areaStyle: {}, emphasis: { focus: 'series' }, data: [10, 8, 10, 10] }
    ]
  });

  // Stock Industry Distribution Option
  const getStockIndustryOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: { data: ['组合权重', '基准权重'], top: 0 },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    yAxis: { type: 'category', data: mockStockIndustry.map(d => d.industry) },
    series: [
      { name: '组合权重', type: 'bar', data: mockStockIndustry.map(d => d.weight), itemStyle: { color: '#023D7F' } },
      { name: '基准权重', type: 'bar', data: mockStockIndustry.map(d => d.benchmarkWeight), itemStyle: { color: '#B0BEC5' } }
    ]
  });

  // Bond Type Distribution Option (Stacked Bar Chart + Line Chart as per user image)
  const getBondTypeOption = () => {
    const categories = [
      '政策性金融债', '商金债', '中期票据', '国债', '可转债', '企业债', 
      '资产支持证券', '银行存款和结算备付金', '企业短期融资券', '央行票据', 
      '地方政府债', '中小企业私募债券', '其他债券', '买入返售金融资产', 
      '货币市场工具', '同业存单'
    ];
    const quarters = ['2021Q1', '2021Q2', '2021Q3', '2021Q4', '2022Q1', '2022Q2', '2022Q3', '2022Q4', '2023Q1', '2023Q2', '2023Q3', '2023Q4', '2024Q1', '2024Q2', '2024Q3', '2024Q4', '2025Q1', '2025Q2', '2025Q3', '2025Q4'];
    
    // Colors extracted from the user provided image
    const colors = [
      '#E6B652', '#74529E', '#3C6291', '#5A9BD5', '#4E6A94', '#C0504D', 
      '#9BBB59', '#8064A2', '#C0504D', '#4BACC6', '#F79646', '#92D050', 
      '#0070C0', '#C00000', '#FFC000', '#7030A0'
    ];

    const series: any[] = categories.map((cat, index) => ({
      name: cat,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: quarters.map(() => (Math.random() * 10 + 5).toFixed(2)),
      itemStyle: { color: colors[index % colors.length] },
      barWidth: '40%'
    }));

    // Add the line series as seen in the first image
    series.push({
      name: '加权平均平底溢价率(右)',
      type: 'line',
      yAxisIndex: 1,
      data: quarters.map(() => (Math.random() * 40 + 60).toFixed(2)),
      itemStyle: { color: '#FF5A5A' },
      lineStyle: { width: 2 },
      symbol: 'circle',
      symbolSize: 6,
      emphasis: { focus: 'series' }
    });

    return {
      tooltip: { 
        trigger: 'axis', 
        axisPointer: { type: 'shadow' },
        formatter: (params: any) => {
          let res = params[0].name + '<br/>';
          params.forEach((item: any) => {
            res += item.marker + item.seriesName + ': ' + item.value + (item.seriesType === 'bar' ? '%' : '') + '<br/>';
          });
          return res;
        }
      },
      legend: { 
        data: [...categories, '加权平均平底溢价率(右)'], 
        top: 0, 
        type: 'scroll',
        itemWidth: 12,
        itemHeight: 12,
        textStyle: { fontSize: 10 }
      },
      grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
      xAxis: { 
        type: 'category', 
        data: quarters,
        axisLabel: { fontSize: 10 },
        axisTick: { alignWithLabel: true }
      },
      yAxis: [
        { 
          type: 'value', 
          name: '占比',
          max: 140,
          axisLabel: { formatter: '{value}%', fontSize: 10 },
          splitLine: { lineStyle: { type: 'dashed' } }
        },
        {
          type: 'value',
          name: '溢价率',
          axisLabel: { fontSize: 10 },
          splitLine: { show: false }
        }
      ],
      series: series
    };
  };

  const stockColumns = [
    { title: '股票名称', dataIndex: 'name', key: 'name' },
    { title: '代码', dataIndex: 'code', key: 'code' },
    { title: '持仓市值(元)', dataIndex: 'value', key: 'value', render: (val: number) => val.toLocaleString() },
    { title: '权重(%)', dataIndex: 'weight', key: 'weight', render: (val: number) => val.toFixed(2) },
    { title: '当日贡献(%)', dataIndex: 'contribution', key: 'contribution', render: (val: number) => (
      <Text style={{ color: val >= 0 ? '#D50000' : '#00BFA5' }}>{val > 0 ? '+' : ''}{val.toFixed(2)}%</Text>
    )}
  ];

  const stockData = [
    { key: '1', name: '贵州茅台', code: '600519.SH', value: 5420000, weight: 12.04, contribution: 0.15 },
    { key: '2', name: '宁德时代', code: '300750.SZ', value: 4210000, weight: 9.35, contribution: -0.24 },
    { key: '3', name: '招商银行', code: '600036.SH', value: 3120000, weight: 6.93, contribution: 0.08 },
    { key: '4', name: '中国平安', code: '601318.SH', value: 2850000, weight: 6.33, contribution: 0.12 },
    { key: '5', name: '五粮液', code: '000858.SZ', value: 2150000, weight: 4.78, contribution: -0.05 },
  ];

  const items = [
    {
      key: '1',
      label: '资产配置',
      children: (
        <div className="space-y-6">
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title={renderTitle("历史资产配置比例变化", "展示组合大类资产配置比例的历史演变过程。")} variant="borderless">
                <ReactECharts option={getMajorAllocationOption()} style={{ height: 450 }} />
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card title={renderTitle("债券品种分布", "展示债券资产在国债、金融债、信用债等不同品种上的分布。")} variant="borderless">
                <ReactECharts option={getBondTypeOption()} style={{ height: 500 }} />
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card variant="borderless">
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default AssetAllocation;
