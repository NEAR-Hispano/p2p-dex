<template>
  <a-card>
    <div :class="advanced ? 'search' : null">
      <a-form layout="horizontal">
        <div :class="advanced ? null: 'fold'">
          <a-row >
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="The rule number"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-input placeholder="Please enter" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="Use status"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-select placeholder="Please select">
                <a-select-option value="1">Shut down</a-select-option>
                <a-select-option value="2">In operation</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="The number of calls"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-input-number style="width: 100%" placeholder="Please enter" />
            </a-form-item>
          </a-col>
        </a-row>
          <a-row v-if="advanced">
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="The date of the update"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-date-picker style="width: 100%" placeholder="Please enter the update date" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="Use status"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-select placeholder="Please select">
                <a-select-option value="1">Shut down</a-select-option>
                <a-select-option value="2">In operation</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24" >
            <a-form-item
              label="description"
              :labelCol="{span: 5}"
              :wrapperCol="{span: 18, offset: 1}"
            >
              <a-input placeholder="Please enter" />
            </a-form-item>
          </a-col>
        </a-row>
        </div>
        <span style="float: right; margin-top: 3px;">
          <a-button type="primary">查询</a-button>
          <a-button style="margin-left: 8px">重置</a-button>
          <a @click="toggleAdvanced" style="margin-left: 8px">
            {{advanced ? 'Put it away' : 'unfold'}}
            <a-icon :type="advanced ? 'up' : 'down'" />
          </a>
        </span>
      </a-form>
    </div>
    <div>
      <a-space class="operator">
        <a-button @click="addNew" type="primary">newly built</a-button>
        <a-button >Bulk operation</a-button>
        <a-dropdown>
          <a-menu @click="handleMenuClick" slot="overlay">
            <a-menu-item key="delete">Delete</a-menu-item>
            <a-menu-item key="audit">Approval</a-menu-item>
          </a-menu>
          <a-button>
            More action <a-icon type="down" />
          </a-button>
        </a-dropdown>
      </a-space>
      <standard-table
        :columns="columns"
        :dataSource="dataSource"
        :selectedRows.sync="selectedRows"
        @clear="onClear"
        @change="onChange"
        @selectedRowChange="onSelectChange"
      >
        <div slot="description" slot-scope="{text}">
          {{text}}
        </div>
        <div slot="action" slot-scope="{text, record}">
          <a style="margin-right: 8px">
            <a-icon type="plus"/>New
          </a>
          <a style="margin-right: 8px">
            <a-icon type="edit"/>edit
          </a>
          <a @click="deleteRecord(record.key)">
            <a-icon type="delete" />Delete 1
          </a>
          <a @click="deleteRecord(record.key)" v-auth="`delete`">
            <a-icon type="delete" />Delete 2
          </a>
          <router-link :to="`/list/query/detail/${record.key}`" >detail</router-link>
        </div>
        <template slot="statusTitle">
          <a-icon @click.native="onStatusTitleClick" type="info-circle" />
        </template>
      </standard-table>
    </div>
  </a-card>
</template>

<script>
import StandardTable from '@/components/table/StandardTable'
const columns = [
  {
    title: 'The rule number',
    dataIndex: 'no'
  },
  {
    title: 'description',
    dataIndex: 'description',
    scopedSlots: { customRender: 'description' }
  },
  {
    title: 'The number of service calls',
    dataIndex: 'callNo',
    sorter: true,
    needTotal: true,
    customRender: (text) => text + ' 次'
  },
  {
    dataIndex: 'status',
    needTotal: true,
    slots: {title: 'statusTitle'}
  },
  {
    title: 'The update time',
    dataIndex: 'updatedAt',
    sorter: true
  },
  {
    title: 'operate',
    scopedSlots: { customRender: 'action' }
  }
]

const dataSource = []

for (let i = 0; i < 100; i++) {
  dataSource.push({
    key: i,
    no: 'NO ' + i,
    description: 'This is a description',
    callNo: Math.floor(Math.random() * 1000),
    status: Math.floor(Math.random() * 10) % 4,
    updatedAt: '2018-07-26'
  })
}

export default {
  name: 'QueryList',
  components: {StandardTable},
  data () {
    return {
      advanced: true,
      columns: columns,
      dataSource: dataSource,
      selectedRows: []
    }
  },
  authorize: {
    deleteRecord: 'delete'
  },
  methods: {
    deleteRecord(key) {
      this.dataSource = this.dataSource.filter(item => item.key !== key)
      this.selectedRows = this.selectedRows.filter(item => item.key !== key)
    },
    toggleAdvanced () {
      this.advanced = !this.advanced
    },
    remove () {
      this.dataSource = this.dataSource.filter(item => this.selectedRows.findIndex(row => row.key === item.key) === -1)
      this.selectedRows = []
    },
    onClear() {
      this.$message.info('You emptied all the rows you checked')
    },
    onStatusTitleClick() {
      this.$message.info('You clicked on the status bar header')
    },
    onChange() {
      this.$message.info('The table status has changed')
    },
    onSelectChange() {
      this.$message.info('The selected line has changed')
    },
    addNew () {
      this.dataSource.unshift({
        key: this.dataSource.length,
        no: 'NO ' + this.dataSource.length,
        description: 'This is a description',
        callNo: Math.floor(Math.random() * 1000),
        status: Math.floor(Math.random() * 10) % 4,
        updatedAt: '2018-07-26'
      })
    },
    handleMenuClick (e) {
      if (e.key === 'delete') {
        this.remove()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .search{
    margin-bottom: 54px;
  }
  .fold{
    width: calc(100% - 216px);
    display: inline-block
  }
  .operator{
    margin-bottom: 18px;
  }
  @media screen and (max-width: 900px) {
    .fold {
      width: 100%;
    }
  }
</style>
