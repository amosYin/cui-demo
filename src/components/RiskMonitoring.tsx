
import React, { useState } from 'react';
import { Row, Col, Card, Table, Typography, Space, Progress, InputNumber, Button, Tag, Alert, Badge } from 'antd';
import ReactECharts from 'echarts-for-react';
import { mockRiskIndicators } from '../mockData';

const { Title, Text } = Typography;

const RiskMonitoring: React.FC = () => {
  // Leverage Chart Option
  const getLeverageOption = () => ({
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: ['2025-12', '2026-01', '2026-02', '2026-03'] },
    yAxis: { type: 'value', name: '杠杆率(%)', min: 100, max: 150 },
    series: [
      {
        name: '历史杠杆率',
        type: 'line',
        data: [120, 125, 128, 125.4],
        itemStyle: { color: '#023D7F' },
        markLine: { data: [{ yAxis: 140, name: '预警线', lineStyle: { color: '#ff4d4f' } }] }
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
    { title: '类型', dataIndex: 'type', key: 'type', render: (val: string) => <Tag color={val === '股票' ? 'blue' : 'green'}>{val}</Tag> },
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
          <Card title="杠杆率监控" bordered={false}>
            <ReactECharts option={getLeverageOption()} style={{ height: 350 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="组合久期监控" bordered={false}>
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
          <Card title="前五大集中度监控" bordered={false}>
            <Table columns={concentrationColumns} dataSource={concentrationData} pagination={false} size="middle" />
          </Card>
        </Col>
      </Row>

      <Card title="信用风险分布" bordered={false}>
        <ReactECharts 
          option={{
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            legend: { data: ['AAA', 'AA+', 'AA', 'A-1', '无评级'] },
            xAxis: { type: 'category', data: ['2025-12', '2026-01', '2026-02', '2026-03'] },
            yAxis: { type: 'value', name: '市值(万元)' },
            series: [
              { name: 'AAA', type: 'bar', stack: 'total', data: [1200, 1300, 1400, 1500], itemStyle: { color: '#023D7F' } },
              { name: 'AA+', type: 'bar', stack: 'total', data: [700, 750, 780, 800], itemStyle: { color: '#1890ff' } },
              { name: 'AA', type: 'bar', stack: 'total', data: [300, 350, 380, 400], itemStyle: { color: '#52c41a' } },
              { name: 'A-1', type: 'bar', stack: 'total', data: [150, 180, 190, 200], itemStyle: { color: '#faad14' } },
              { name: '无评级', type: 'bar', stack: 'total', data: [80, 90, 95, 100], itemStyle: { color: '#bfbfbf' } }
            ]
          }} 
          style={{ height: 400 }} 
        />
      </Card>
    </div>
  );
};

export default RiskMonitoring;
