<template>
  <a-card class="result-success" :bordered="false">
    <result :is-success="true" :description="description" :title="title">
      <template slot="action">
        <a-button class="action" type="primary">Return to the list</a-button>
        <a-button class="action" >View the project</a-button>
        <a-button class="action" @click="print">print</a-button>
      </template>
      <div>
        <div class="project-name">The name of the project</div>
        <detail-list size="small" style="max-width: 800px; margin-bottom: 8px">
          <detail-list-item term="Project ID">20180724089</detail-list-item>
          <detail-list-item term="Head">Qu Lili</detail-list-item>
          <detail-list-item term="The effective time">016-12-12 ~ 2017-12-12</detail-list-item>
        </detail-list>
        <a-steps :current="1" progressDot>
          <a-step title="Create a project">
            <a-step-item-group slot="description">
              <a-step-item title="Qu Lili" icon="dingding-o"/>
              <a-step-item title="2016-12-12 12:32"/>
            </a-step-item-group>
          </a-step>
          <a-step title="Departmental first instance">
            <a-step-item-group slot="description">
              <a-step-item title="Zhou Mao hair" icon="dingding-o" :iconStyle="{color: '#00A0E9'}"/>
              <a-step-item title="Give it a try" :titleStyle="{color: '#00A0E9'}"/>
            </a-step-item-group>
          </a-step>
          <a-step title="Financial review"></a-step>
          <a-step title="finish" ></a-step>
        </a-steps>
      </div>
    </result>
  </a-card>
</template>

<script>
import Result from '../../components/result/Result'
import DetailList from '../../components/tool/DetailList'
import AStepItem from '../../components/tool/AStepItem'

const AStepItemGroup = AStepItem.Group
const DetailListItem = DetailList.Item
export default {
  name: 'Success',
  components: {AStepItemGroup, AStepItem, DetailListItem, DetailList, Result},
  data () {
    return {
      title: 'The submission was successful',
      description: 'The Submit Results page is used to feed back the results of a series of operational tasks，\n' +
      " If it's just a simple operation, use Message Global Prompt Feedback\n" +
      ' This text area can show simple additional instructions if there is a similar display\n' +
      ' "Document" requirements, the following gray area can present more complex content。'
    }
  },
  methods: {
    print () {
      window.print()
    }
  }
}
</script>

<style scoped lang="less">
.result-success{
  .action:not(:first-child){
    margin-left: 8px;
  }
  .project-name{
    font-size: 16px;
    color: @title-color;
    font-weight: 500;
    margin-bottom: 20px;
  }
}
</style>
