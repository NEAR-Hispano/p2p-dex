<template>
  <div style="display: flex">
    <task-group class="task-group" title="ToDo" group="task">
      <task-item :key="index" v-for="(item, index) in todoList" :content="item" />
    </task-group>
    <task-group class="task-group" title="In Progress" group="task">
      <task-item :key="index" v-for="(item, index) in inproList" :content="item" />
    </task-group>
    <task-group class="task-group" title="Done" group="task">
      <task-item :key="index" v-for="(item, index) in doneList" :content="item" />
    </task-group>
  </div>
</template>

<script>
import TaskGroup from '../../components/task/TaskGroup'
import TaskItem from '../../components/task/TaskItem'
const todoList = ['Mission One', 'Mission Two', 'Mission THREE', 'Task Four', 'Mission Five', 'Mission Six']
const inproList = ['Mission VII', 'Mission VII', 'Mission Nine', 'Mission Ten', 'Mission ELEVEN', 'Mission 12']
const doneList = ['Task XII', 'Mission XIVI', 'Mission XVI', 'Mission XVI', 'Mission XVI', 'Mission XVI']
export default {
  name: 'TaskCard',
  components: {TaskItem, TaskGroup},
  data () {
    return {
      todoList,
      inproList,
      doneList
    }
  }
}
</script>

<style lang="less" scoped>
  .task-group{
    margin: 0 48px;
  }
  .dragable-ghost{
    border: 1px dashed red;
    opacity: 1;
  }
  .dragable-chose{
    border: 1px dashed red;
    opacity: 0.8;
  }
  .dragable-drag{
    border: 1px dashed red;
    opacity: 1;
  }
</style>
