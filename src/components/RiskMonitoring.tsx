
import React, { useState } from 'react';
import { Row, Col, Card, Table, Typography, Space, Progress, InputNumber, Button, Tag, Alert, Badge, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import ReactECharts from 'echarts-for-react';
import { mockRiskIndicators } from '../mockData';

const { Title, Text } = Typography;

const RiskMonitoring: React.FC = () => {
  const renderTitle = (title: string, subTitle: string, description: string) => (
    <Space size={4}>
      <span>{title}</span>
      <Text type="secondary" style={{ fontSize: '12px', fontWeight: 'normal', marginLeft: 4 }}>{subTitle}</Text>
      <Tooltip title={description}>
        <QuestionCircleOutlined style={{ color: '#bfbfbf', fontSize: '14px', cursor: 'help' }} />
      </Tooltip>
    </Space>
  );
  // Leverage Chart Option
  const getLeverageOption = () => ({
    tooltip: { trigger: 'axis' },
    legend: { data: ['历史杠杆率'], top: 0 },
    grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
    xAxis: { type: 'category', data: ['2025-12', '2026-01', '2026-02', '2026-03'] },
    yAxis: { type: 'value', name: '杠杆率(%)', min: 100, max: 150 },
    series: [
      {
        name: '历史杠杆率',
        type: 'line',
        data: [120, 125, 128, 125.4],
        itemStyle: { color: '#023D7F' },
        markLine: { data: [{ yAxis: 140, name: '预警线', lineStyle: { color: '#D50000' } }] }
      }
    ]
  });

  // Duration Gauge Option
  const getDurationOption = () => ({
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 10,
        splitNumber: 5,
        itemStyle: { color: '#023D7F' },
        progress: { show: true, width: 18 },
        pointer: { show: false },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        title: { show: false },
        detail: {
          valueAnimation: true,
          width: '60%',
          lineHeight: 40,
          borderRadius: 8,
          offsetCenter: [0, '-15%'],
          fontSize: 30,
          fontWeight: 'bolder',
          formatter: '{value}年',
          color: 'auto'
        },
        data: [{ value: 3.2 }]
      }
    ]
  });

  const concentrationColumns = [
    { title: '持仓名称', dataIndex: 'name', key: 'name' },
    { title: '类型', dataIndex: 'type', key: 'type', render: (val: string) => <Tag color={val === '股票' ? '#023D7F' : '#00BFA5'}>{val}</Tag> },
    { title: '占比(%)', dataIndex: 'percentage', key: 'percentage', render: (val: number) => (
      <Space>
        <Progress percent={val} size="small" showInfo={false} style={{ width: 100 }} strokeColor="#023D7F" />
        <Text strong>{val.toFixed(2)}%</Text>
      </Space>
    )}
  ];

  const concentrationData = [
    { key: '1', name: '贵州茅台', type: '股票', percentage: 12.04 },
    { key: '2', name: '23国债01', type: '债券', percentage: 10.52 },
    { key: '3', name: '宁德时代', type: '股票', percentage: 9.35 },
    { key: '4', name: '22国开05', type: '债券', percentage: 8.21 },
    { key: '5', name: '招商银行', type: '股票', percentage: 6.93 },
  ];

  return (
    <div className="space-y-6">
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card title={renderTitle("杠杆率监控", "Leverage Monitoring", "监控组合的总杠杆率水平，并与监管/内部预警线进行对比。")} bordered={false} style={{ height: '100%' }}>
            <ReactECharts option={getLeverageOption()} style={{ height: 350 }} />
            <div style={{ height: 22 }}></div> {/* Spacer to match badges height */}
          </Card>
        </Col>
        <Col span={12}>
          <Card title={renderTitle("组合久期监控", "Portfolio Duration Monitoring", "展示组合的修正久期，并对比基准久期，评估利率风险敏感度。")} bordered={false} style={{ height: '100%' }}>
            <ReactECharts option={getDurationOption()} style={{ height: 350 }} />
            <div className="text-center">
              <Space>
                <Badge status="processing" text="修正久期: 3.12年" color="#023D7F" />
                <Badge status="processing" text="基准久期: 3.50年" />
                <Badge status="warning" text="久期偏离: -0.38年" />
              </Space>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title={renderTitle("前五大集中度监控", "Top 5 Concentration Monitoring", "监控前五大持仓的合计占比，防范个券集中度风险。")} bordered={false}>
            <Table columns={concentrationColumns} dataSource={concentrationData} pagination={false} size="middle" />
          </Card>
        </Col>
      </Row>

      <Card title={renderTitle("信用风险分布", "Credit Risk Distribution", "展示债券组合在不同信用评级下的市值分布及历史变化。")} bordered={false}>
        <ReactECharts 
          option={{
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: ['AAA', 'AA+', 'AA', 'A-1', '无评级'], top: 0 },
            grid: { left: '3%', right: '4%', bottom: '5%', top: '15%', containLabel: true },
            xAxis: { type: 'category', data: ['2025-12', '2026-01', '2026-02', '2026-03'] },
            yAxis: { type: 'value', name: '市值(万元)' },
            series: [
              { name: 'AAA', type: 'bar', stack: 'total', data: [1200, 1300, 1400, 1500], itemStyle: { color: '#023D7F' } },
              { name: 'AA+', type: 'bar', stack: 'total', data: [700, 750, 780, 800], itemStyle: { color: '#0066CC' } },
              { name: 'AA', type: 'bar', stack: 'total', data: [300, 350, 380, 400], itemStyle: { color: '#4DA1FF' } },
              { name: 'A-1', type: 'bar', stack: 'total', data: [150, 180, 190, 200], itemStyle: { color: '#00BFA5' } },
              { name: '无评级', type: 'bar', stack: 'total', data: [80, 90, 95, 100], itemStyle: { color: '#B0BEC5' } }
            ]
          }} 
          style={{ height: 400 }} 
        />
      </Card>
    </div>
  );
};

export default RiskMonitoring;
