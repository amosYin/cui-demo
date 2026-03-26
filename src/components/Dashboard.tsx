
import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import dayjs from 'dayjs';
import { mockNetValueData, mockAssetAllocation, mockPerformanceAttribution, mockRiskIndicators } from '../mockData';
import { useFilters } from '../App';
import { Tooltip } from 'antd';

const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
  const { filters } = useFilters();

  const renderTitle = (title: string, subTitle: string, description: string) => (
    <Space size={4}>
      <span>{title}</span>
      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: 4 }}>{subTitle}</Text>
      <Tooltip title={description}>
        <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: '14px', cursor: 'help' }} />
      </Tooltip>
    </Space>
  );

  // Performance Trend Chart Option
  const getPerformanceTrendOption = () => {
    // Generate dates from 2019 to 2024 for a more realistic look matching the image
    const startDate = dayjs('2019-08-05');
    const endDate = dayjs('2024-03-13');
    const days = endDate.diff(startDate, 'day');
    const chartDates = [];
    const productData = [];
    const benchmarkData = [];
    const excessData = [];

    let currentProduct = 1.0;
    let currentBenchmark = 1.0;

    for (let i = 0; i <= days; i += 7) { // Sample every 7 days
      const date = startDate.add(i, 'day').format('YYYY-MM-DD');
      chartDates.push(date);
      
      // Simulate trends
      const pRand = (Math.random() - 0.48) * 0.02;
      const bRand = (Math.random() - 0.5) * 0.015;
      
      currentProduct *= (1 + pRand);
      currentBenchmark *= (1 + bRand);
      
      productData.push(currentProduct.toFixed(4));
      benchmarkData.push(currentBenchmark.toFixed(4));
      excessData.push((currentProduct - currentBenchmark).toFixed(4));
    }

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: { 
        data: ['累计超额收益', '安联测试产品1', '业绩基准'],
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
      yAxis: [
        { 
          type: 'value', 
          min: 0.9, 
          max: 1.6, 
          interval: 0.1,
          axisLabel: { color: '#8c8c8c' },
          splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
        },
        { 
          type: 'value', 
          min: 0, 
          max: 0.5, 
          interval: 0.05,
          axisLabel: { color: '#8c8c8c' },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: '累计超额收益',
          type: 'line',
          yAxisIndex: 1,
          data: excessData,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#BC4736' },
          lineStyle: { width: 2.5 }
        },
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
        },
        {
          name: '业绩基准',
          type: 'line',
          data: benchmarkData,
          smooth: true,
          showSymbol: false,
          itemStyle: { color: '#3AA1FF' },
          lineStyle: { width: 2, type: 'dashed' }
        }
      ]
    };
  };

  const getAllocationOption = () => ({
    tooltip: { trigger: 'item', formatter: '{a} <br/>{b}: {c} ({d}%)' },
    legend: { bottom: '0', left: 'center', icon: 'circle', textStyle: { color: '#8c8c8c' } },
    series: [
      {
        name: '资产配置',
        type: 'pie',
        radius: ['45%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '16', fontWeight: 'bold' } },
        labelLine: { show: false },
        data: mockAssetAllocation.map(item => ({ name: item.type, value: item.value })),
        color: ['#4ECBEE', '#3AA1FF', '#BC4736', '#9254DE', '#FADB14']
      }
    ]
  });

  const getAttributionOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '4%', bottom: '15%', top: '5%', containLabel: true },
    xAxis: { 
      type: 'value', 
      axisLabel: { formatter: '{value}%', color: '#8c8c8c' },
      splitLine: { lineStyle: { type: 'dashed', color: '#f0f0f0' } }
    },
    yAxis: { 
      type: 'category', 
      data: mockPerformanceAttribution.map(item => item.category),
      axisLabel: { color: '#8c8c8c' },
      axisLine: { lineStyle: { color: '#f0f0f0' } }
    },
    series: [
      {
        name: '收益贡献',
        type: 'bar',
        barWidth: '40%',
        data: mockPerformanceAttribution.map(item => (item.allocationEffect + item.selectionEffect + item.interactionEffect).toFixed(2)),
        itemStyle: {
          borderRadius: [0, 4, 4, 0],
          color: (params: any) => params.value > 0 ? '#BC4736' : '#4ECBEE'
        },
        label: { show: true, position: 'right', formatter: '{c}%', fontSize: 10 }
      }
    ]
  });

  const performanceTableColumns = [
    { title: '绩效指标', dataIndex: 'metric', key: 'metric', className: 'bg-gray-50 font-medium' },
    { title: '安联测试产品1', dataIndex: 'product', key: 'product', align: 'center' as const },
    { title: '业绩基准', dataIndex: 'benchmark', key: 'benchmark', align: 'center' as const },
    { title: '超额收益绩效表现', dataIndex: 'excess', key: 'excess', align: 'center' as const, className: 'font-bold' },
  ];

  const performanceTableData = [
    { key: '1', metric: '累计收益率', product: '20.01%', benchmark: '13.24%', excess: '6.77%' },
    { key: '2', metric: '年化收益', product: '4.19%', benchmark: '2.84%', excess: '1.35%' },
    { key: '3', metric: '波动率', product: '11.55%', benchmark: '6.65%', excess: '4.90%' },
    { key: '4', metric: '夏普率', product: '0.2849', benchmark: '0.2310', excess: '0.0539' },
    { key: '5', metric: '最大回撤', product: '-28.26%', benchmark: '-10.70%', excess: '-17.56%' },
    { key: '6', metric: '卡玛比率', product: '0.1483', benchmark: '0.2654', excess: '-0.1171' },
    { key: '7', metric: '阿尔法(Alpha)', product: '-', benchmark: '-', excess: '1.25%' },
    { key: '8', metric: '贝塔(Beta)', product: '-', benchmark: '-', excess: '1.12' },
    { key: '9', metric: '跟踪误差', product: '-', benchmark: '-', excess: '8.42%' },
    { key: '10', metric: '信息比率(IR)', product: '-', benchmark: '-', excess: '0.1888' },
  ];

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic
              title="单位净值"
              value={1.1245}
              precision={4}
              styles={{ content: { color: '#023D7F' } }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card variant="borderless" hoverable>
            <Statistic
              title="日收益"
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
              title="今年以来收益"
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
              title="最大回撤"
              value={-4.2}
              precision={2}
              styles={{ content: { color: '#4ECBEE' } }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 - Performance Trend */}
      <Card title={renderTitle("业绩走势", "Performance Trend", "展示产品累计收益率、基准收益率与超额收益随时间的变化趋势。")} variant="borderless">
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
          <ul className="list-none p-0 m-0 space-y-2 text-sm">
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-gray-800 rounded-sm shrink-0"></span>
              <span><Text strong>产品业绩基准：</Text>中债总财富指数收益率*62.89%+中证800指数收益率*37.11%</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-gray-800 rounded-sm shrink-0"></span>
              <span><Text strong>产品整体表现：</Text>产品成立以来，累计收益率为20.01%，年化收益率为4.19%，最大回撤-28.26%，夏普比率0.2849。</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-gray-800 rounded-sm shrink-0"></span>
              <span><Text strong>相对基准表现：</Text>组合相对基准有明显的超额收益。截至20240313，累计超额收益为6.77%，年化超额为1.35%，超额收益的最大回撤为-17.56%。</span>
            </li>
            <li className="flex items-start">
              <span className="inline-block w-2 h-2 mt-1.5 mr-2 bg-gray-800 rounded-sm shrink-0"></span>
              <span><Text strong>超额收益表现提示：</Text>组合的超额收益自2021年10月起逐渐下滑。</span>
            </li>
          </ul>
        </div>
        
        <Row gutter={24}>
          <Col span={16}>
            <ReactECharts option={getPerformanceTrendOption()} style={{ height: 500 }} />
          </Col>
          <Col span={8}>
            <div className="h-full flex flex-col justify-center overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-200 text-xs">
                <thead>
                  <tr className="bg-[#023D7F] text-white">
                    <th className="p-2 border border-gray-300 whitespace-nowrap">绩效指标</th>
                    <th className="p-2 border border-gray-300 whitespace-nowrap">安联测试产品1</th>
                    <th className="p-2 border border-gray-300 whitespace-nowrap">业绩基准</th>
                    <th className="p-2 border border-gray-300 whitespace-nowrap">超额收益绩效表现</th>
                  </tr>
                </thead>
                <tbody>
                  {performanceTableData.map((row) => (
                    <tr key={row.key} className="hover:bg-gray-50">
                      <td className="p-2 border border-gray-300 font-medium bg-gray-50">{row.metric}</td>
                      <td className="p-2 border border-gray-300 text-center">{row.product}</td>
                      <td className="p-2 border border-gray-300 text-center">{row.benchmark}</td>
                      <td className="p-2 border border-gray-300 text-center font-bold">{row.excess}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
      </Card>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title={renderTitle("资产配置概览", "Asset Allocation Overview", "展示当前组合在股票、债券、基金、现金等大类资产上的配置比例。")} variant="borderless">
            <ReactECharts option={getAllocationOption()} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={renderTitle("业绩归因摘要 (收益贡献)", "Performance Attribution Summary", "基于Brinson模型，展示本月各资产类别对组合超额收益的贡献度。")} variant="borderless">
            <ReactECharts option={getAttributionOption()} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 3 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={renderTitle("风险监控预警", "Risk Monitoring & Alerts", "实时监控关键风险指标（如杠杆率、久期、集中度等）是否超过设定的预警阈值。")} variant="borderless">
            <Row gutter={48}>
              {mockRiskIndicators.map(indicator => (
                <Col span={6} key={indicator.name}>
                  <div className="py-4">
                    <div className="flex justify-between mb-2">
                      <Text strong>{indicator.name}</Text>
                      <Text strong style={{ color: '#023D7F' }}>
                        {indicator.value}{indicator.unit}
                      </Text>
                    </div>
                    <Progress 
                      percent={(indicator.value / indicator.threshold) * 100} 
                      showInfo={false}
                      strokeColor={indicator.value > indicator.threshold ? '#D50000' : '#023D7F'}
                    />
                    <Text type="secondary" style={{ fontSize: '12px' }}>阈值: {indicator.threshold}{indicator.unit}</Text>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
