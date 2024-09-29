'use client';

import NavLink from '@/app/nav-link';
import { BarChart } from '@/components/barChart';
import { CardAsset } from '@/components/cards/cardAsset';
import { CardCompany } from '@/components/cards/cardCompany';
import { CardUnit } from '@/components/cards/cardUnit';
import { CardUser } from '@/components/cards/cardUser';
import { PieChart } from '@/components/pieChart';
import {  Card, Col, Row, Typography } from 'antd';
import React from 'react';

const { Title, Link } = Typography;


const DashboardPage = () => {

  return <div>
    <h3>Hello Dashboard</h3>
      <Row>
        <Col style={{ padding: 5 }}>
          <Card
            style={{
              display: 'flex',
              width: 350,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Title level={4}>Ativos</Title>
            <CardAsset />
            <NavLink href="/assets">
              <Link>ver detalhes</Link>
            </NavLink>
          </Card>
        </Col>
        <Col style={{ padding: 5 }}>
          <Card
            style={{
              display: 'flex',
              width: 350,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Title level={4}>Usuários</Title>
            <CardUser />
            <NavLink href="/users">
              <Link>ver detalhes</Link>
            </NavLink>
          </Card>
        </Col>
        <Col style={{ padding: 5 }}>
          <Card
            style={{
              display: 'flex',
              width: 350,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Title level={4}>Unidades</Title>
            <CardUnit />
            <NavLink href="/units">
              <Link>ver detalhes</Link>
            </NavLink>
          </Card>
        </Col>
        <Col style={{ padding: 5 }}>
          <Card
            style={{
              display: 'flex',
              width: 350,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Title level={4}>Empresas</Title>
            <CardCompany />
            <NavLink href="/companies">
              <Link>ver detalhes</Link>
            </NavLink>
          </Card>
        </Col>

        <Col style={{ padding: 10 }}>
          <Card style={{ width: 700, height: 500 }}>
            <Title level={4}>Ativos | Status | Saúde</Title>
            <BarChart />
            <NavLink href="/assets">
              <Link>ver detalhes</Link>
            </NavLink>
          </Card>
        </Col>

        <Col style={{ padding: 10 }}>
          <Card style={{ width: 700, height: 500 }}>
            <Title level={4}>Ativos | Métricas | Especificações</Title>
            <div style={{ marginLeft: '11rem' }}>
              <PieChart />
            </div>
            <NavLink href="/assets">
              <Link>ver detalhes</Link>
            </NavLink>
          </Card>
        </Col>
      </Row>
  </div>;
};

export default DashboardPage;
