<template>
  <page-layout title="Number：234231029431" logo="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png">
    <detail-list size="small" :col="2" slot="headerContent">
      <detail-list-item term="The creator">Qu Lili</detail-list-item>
      <detail-list-item term="Order the product">XX service</detail-list-item>
      <detail-list-item term="The time of creation">2018-08-07</detail-list-item>
      <detail-list-item term="The associated document"><a>12421</a></detail-list-item>
      <detail-list-item term="Effective date">2018-08-07 ~ 2018-12-11</detail-list-item>
      <detail-list-item term="remark">Please confirm within two business days</detail-list-item>
    </detail-list>
    <template slot="extra">
      <head-info title="state" content="Pending approval" />
      <head-info title="The order amount" content="¥ 568.08" />
    </template>
    <template slot="action">
      <a-button-group style="margin-right: 8px;">
        <a-button>operate</a-button>
        <a-button>operate</a-button>
        <a-button><a-icon type="ellipsis"/></a-button>
      </a-button-group>
      <a-button type="primary" >The main action</a-button>
    </template>
    <a-card :bordered="false" title="Process progress">
      <a-steps :current="1" progress-dot :direction="isMobile ? 'vertical' : 'horizontal'">
        <a-step title="Create a project">
          <a-step-item-group :align="isMobile ? 'left' : 'center'" slot="description">
            <a-step-item link="/dashboard/workplace" title="Qu Lili" icon="dingding-o"/>
            <a-step-item title="2016-12-12 12:32"/>
          </a-step-item-group>
        </a-step>
        <a-step title="Departmental first instance">
          <a-step-item-group :align="isMobile ? 'left' : 'center'" slot="description">
            <a-step-item link="/form/step" title="Zhou Mao hair" icon="dingding-o" />
            <a-step-item link="/result/success" title="Give it a try" icon="bell"/>
          </a-step-item-group>
        </a-step>
        <a-step title="Financial review">
        </a-step>
        <a-step title="finish">
        </a-step>
      </a-steps>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false" title="User information">
      <detail-list>
        <detail-list-item term="The user's name">Fu Xiaoxiao</detail-list-item>
        <detail-list-item term="Membership card number">32943898021309809423</detail-list-item>
        <detail-list-item term="identity card">3321944288191034921</detail-list-item>
        <detail-list-item term="Contact information">18112345678</detail-list-item>
        <detail-list-item term="Contact address">Huanggushan Road, West Lake District, Hangzhou, Zhejiang Province</detail-list-item>
      </detail-list>
      <detail-list title="field">
        <detail-list-item term="A certain data">725</detail-list-item>
        <detail-list-item term="The time the data was updated">2018-08-08</detail-list-item>
        <detail-list-item >&nbsp;</detail-list-item>
        <detail-list-item term="A certain data">725</detail-list-item>
        <detail-list-item term="The time the data was updated">2018-08-08</detail-list-item>
        <detail-list-item >&nbsp;</detail-list-item>
      </detail-list>
      <a-card type="inner" title="Multi-layered information groups">
        <detail-list title="The group name" size="small">
          <detail-list-item term="Head">Lin Dongdong</detail-list-item>
          <detail-list-item term="The role code">1234567</detail-list-item>
          <detail-list-item term="The department to which it belongs">XX Company -YY Department</detail-list-item>
          <detail-list-item term="Expiration time">2018-08-08</detail-list-item>
          <detail-list-item term="description">This description is long, long, long, long...</detail-list-item>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list title="The group name" size="small" :col="1">
          <detail-list-item term="scientific name">Lin Dongdong</detail-list-item>
          <detail-list-item term="The role code">1234567</detail-list-item>
          <detail-list-item term="The department to which it belongs">XX公司-YY部</detail-list-item>
          <detail-list-item term="Expiration time">2018-08-08</detail-list-item>
          <detail-list-item term="description">This description is long, long, long, long...</detail-list-item>
        </detail-list>
        <a-divider style="margin: 16px 0" />
        <detail-list title="The group name" size="small" :col="2">
          <detail-list-item term="scientific name">Lin Dongdong</detail-list-item>
          <detail-list-item term="The role code">1234567</detail-list-item>
          <detail-list-item term="The department to which it belongs">XX公司-YY部</detail-list-item>
          <detail-list-item term="Expiration time">2018-08-08</detail-list-item>
          <detail-list-item term="description">This description is long, long, long, long...</detail-list-item>
        </detail-list>
      </a-card>
    </a-card>
    <a-card style="margin-top: 24px" :bordered="false" title="The user has been recording electricity for nearly half a year">
      <a-list></a-list>
    </a-card>
    <a-card
      style="margin-top: 24px"
      :bordered="false"
      :tabList="tabList"
      :activeTabKey="activeTabKey"
      @tabChange="(key) => {this.activeTabKey = key}"
    >
      <a-table
        v-if="activeTabKey === '1'"
        :columns="operationColumns"
        :dataSource="operation1"
        :pagination="false"
      />
      <a-table
        v-if="activeTabKey === '2'"
        :columns="operationColumns"
        :dataSource="operation2"
        :pagination="false"
      />
      <a-table
        v-if="activeTabKey === '3'"
        :columns="operationColumns"
        :dataSource="operation3"
        :pagination="false"
      />
    </a-card>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import DetailList from '@/components/tool/DetailList'
import AStepItem from '@/components/tool/AStepItem'
import {operation1, operation2, operation3, operationColumns} from '@/mock/common/tableData'
import {mapState} from 'vuex'
import HeadInfo from '@/components/tool/HeadInfo';


const DetailListItem = DetailList.Item
const AStepItemGroup = AStepItem.Group

const tabList = [
  {
    key: '1',
    tab: 'Action log one'
  },
  {
    key: '2',
    tab: 'Action log two'
  },
  {
    key: '3',
    tab: '操作日志三'
  }
]

export default {
  name: 'AdvancedDetail',
  components: {HeadInfo, AStepItemGroup, AStepItem, DetailListItem, DetailList, PageLayout},
  data () {
    return {
      tabList,
      operationColumns,
      operation1,
      operation2,
      operation3,
      activeTabKey: '2'
    }
  },
  computed: {
    ...mapState('setting', ['isMobile'])
  },
  methods: {
    onTabChange (key) {
      console.log(key)
    }
  },
}
</script>

<style lang="less" scoped>
</style>
