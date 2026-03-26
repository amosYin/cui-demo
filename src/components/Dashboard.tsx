
import React from 'react';
import { Row, Col, Card, Statistic, Typography, Space, Progress } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
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

  // Net Value Chart Option
  const getNetValueOption = () => ({
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' }
    },
    legend: { 
      data: ['单位净值', '累计收益率', '基准收益率'],
      top: 0
    },
    grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
    xAxis: {
      type: 'category',
      data: mockNetValueData.map(d => d.date),
      axisLabel: { 
        rotate: 45,
        fontSize: 10
      }
    },
    yAxis: [
      { type: 'value', name: '净值', min: 0.9, max: 1.3 },
      { type: 'value', name: '收益率(%)', axisLabel: { formatter: '{value}%' } }
    ],
    series: [
      {
        name: '单位净值',
        type: 'line',
        data: mockNetValueData.map(d => d.netValue),
        smooth: true,
        itemStyle: { color: '#023D7F' }
      },
      {
        name: '累计收益率',
        type: 'line',
        yAxisIndex: 1,
        data: mockNetValueData.map(d => d.cumulativeReturn),
        smooth: true,
        itemStyle: { color: '#00BFA5' }
      },
      {
        name: '基准收益率',
        type: 'line',
        yAxisIndex: 1,
        data: mockNetValueData.map(d => d.benchmarkReturn),
        smooth: true,
        lineStyle: { type: 'dashed' },
        itemStyle: { color: '#B0BEC5' }
      }
    ]
  });

  // Asset Allocation Pie Option
  const getAllocationOption = () => ({
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { top: '0', left: 'center' },
    series: [
      {
        name: '资产配置',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '55%'],
        avoidLabelOverlap: false,
        itemStyle: { borderRadius: 10, borderColor: '#fff', borderWidth: 2 },
        label: { show: false, position: 'center' },
        emphasis: { label: { show: true, fontSize: '20', fontWeight: 'bold' } },
        labelLine: { show: false },
        color: ['#023D7F', '#0066CC', '#4DA1FF', '#00BFA5', '#FFB300', '#7E57C2'],
        data: mockAssetAllocation.map(item => ({ value: item.value, name: item.type }))
      }
    ]
  });

  // Performance Attribution Bar Option (Contribution Percentages)
  const getAttributionOption = () => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: '{b}<br/>{a0}: {c0}%<br/>{a1}: {c1}%<br/>{a2}: {c2}%' },
    legend: { 
      data: ['股票贡献', '债券贡献', '基金贡献', '现金贡献'],
      top: 0
    },
    grid: { left: '3%', right: '4%', bottom: '10%', top: '15%', containLabel: true },
    xAxis: { 
      type: 'category', 
      data: ['本月累计'],
      axisLabel: { margin: 15 }
    },
    yAxis: { type: 'value', axisLabel: { formatter: '{value}%' } },
    series: [
      {
        name: '股票贡献',
        type: 'bar',
        stack: 'total',
        data: [1.75],
        itemStyle: { color: '#023D7F' }
      },
      {
        name: '债券贡献',
        type: 'bar',
        stack: 'total',
        data: [0.45],
        itemStyle: { color: '#0066CC' }
      },
      {
        name: '基金贡献',
        type: 'bar',
        stack: 'total',
        data: [0.42],
        itemStyle: { color: '#4DA1FF' }
      },
      {
        name: '现金贡献',
        type: 'bar',
        stack: 'total',
        data: [0.05],
        itemStyle: { color: '#00BFA5' }
      }
    ]
  });

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="单位净值"
              value={1.1245}
              precision={4}
              valueStyle={{ color: '#023D7F' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="日收益"
              value={0.85}
              precision={2}
              valueStyle={{ color: '#D50000' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="今年以来收益"
              value={12.45}
              precision={2}
              valueStyle={{ color: '#D50000' }}
              prefix={<ArrowUpOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} hoverable>
            <Statistic
              title="最大回撤"
              value={-4.2}
              precision={2}
              valueStyle={{ color: '#00BFA5' }}
              prefix={<ArrowDownOutlined />}
              suffix="%"
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 1 */}
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Card title={renderTitle("净值走势", "Net Value Trend", "展示产品单位净值、累计收益率与基准收益率随时间的变化趋势，用于评估产品的超额收益能力。")} bordered={false}>
            <ReactECharts option={getNetValueOption()} style={{ height: 400 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title={renderTitle("资产配置概览", "Asset Allocation Overview", "展示当前组合在股票、债券、基金、现金等大类资产上的配置比例。")} bordered={false}>
            <ReactECharts option={getAllocationOption()} style={{ height: 400 }} />
          </Card>
        </Col>
      </Row>

      {/* Charts Row 2 */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title={renderTitle("业绩归因摘要 (收益贡献)", "Performance Attribution Summary", "基于Brinson模型，展示本月各资产类别对组合超额收益的贡献度。")} bordered={false}>
            <ReactECharts option={getAttributionOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title={renderTitle("风险监控预警", "Risk Monitoring & Alerts", "实时监控关键风险指标（如杠杆率、久期、集中度等）是否超过设定的预警阈值。")} bordered={false}>
            <div className="space-y-8 py-4">
              {mockRiskIndicators.map(indicator => (
                <div key={indicator.name}>
                  <div className="flex justify-between mb-2">
                    <Text strong>{indicator.name}</Text>
                    <Text strong color="#023D7F">
                      {indicator.value}{indicator.unit}
                    </Text>
                  </div>
                  <Progress 
                    percent={(indicator.value / indicator.threshold) * 100} 
                    showInfo={false}
                    strokeColor={indicator.value > indicator.threshold ? '#D50000' : '#023D7F'}
                  />
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
