<template>
  <div class="table">
    <advance-table
      :columns="columns"
      :data-source="dataSource"
      title="Advanced tables-Beta"
      :loading="loading"
      rowKey="id"
      @search="onSearch"
      @refresh="onRefresh"
      :format-conditions="true"
      @reset="onReset"
      :pagination="{
        current: page,
        pageSize: pageSize,
        total: total,
        showSizeChanger: true,
        showLessItems: true,
        showQuickJumper: true,
        showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，总计 ${total} 条`,
        onChange: onPageChange,
        onShowSizeChange: onSizeChange,
      }"
    >
      <template slot="statusTitle">
        状态<a-icon style="margin: 0 4px" type="info-circle" />
      </template>
      <template slot="send" slot-scope="{text}">
        {{text ? 'be' : 'not'}}
      </template>
      <template slot="status" slot-scope="{text}">
        {{text | statusStr}}
      </template>
    </advance-table>
    <api />
  </div>
</template>

<script>
  import AdvanceTable from '@/components/table/advance/AdvanceTable'
  import {dataSource as ds} from '@/services'
  import Api from '@/pages/components/table/Api'

  export default {
    name: 'Table',
    components: {Api, AdvanceTable},
    filters: {
      statusStr(val) {
        switch (val) {
          case 1: return 'An order has been made'
          case 2: return 'Payment made'
          case 3: return 'Reviewed'
          case 4: return 'Shipped'
        }
      }
    },
    data() {
      return {
        loading: false,
        page: 1,
        pageSize: 10,
        total: 0,
        columns: [
          {
            title: 'The product name',
            dataIndex: 'name',
            searchAble: true
          },
          {
            title: 'The order number',
            dataIndex: 'orderId'
          },
          {
            searchAble: true,
            dataIndex: 'status',
            dataType: 'select',
            slots: {title: 'statusTitle'},
            scopedSlots: {customRender: 'status'},
            search: {
              selectOptions: [
                {title: 'An order has been made', value: 1},
                {title: 'Payment made', value: 2},
                {title: 'Reviewed', value: 3},
                {title: 'Shipped', value: 4}
              ]
            }
          },
          {
            title: 'shipments',
            searchAble: true,
            dataIndex: 'send',
            dataType: 'boolean',
            scopedSlots: {customRender: 'send'},
            search: {
              switchOptions: {
                checkedText: 'open',
                uncheckedText: 'close'
              }
            }
          },
          {
            title: 'Review time',
            dataIndex: 'auditTime',
            dataType: 'time',
          }
        ],
        dataSource: [],
        conditions: {}
      }
    },
    created() {
      this.getGoodList()
      this.getColumns()
    },
    methods: {
      getGoodList() {
        this.loading = true
        const {page, pageSize, conditions} = this
        ds.goodsList({page, pageSize, ...conditions}).then(result => {
          const {list, page, pageSize, total} = result.data.data
          this.dataSource = list
          this.page = page
          this.total = total
          this.pageSize = pageSize
          this.loading = false
        })
      },
      getColumns() {
        ds.goodsColumns().then(res => {
          this.columns = res.data
        })
      },
      onSearch(conditions, searchOptions) {
        console.log(searchOptions)
        this.page = 1
        this.conditions = conditions
        this.getGoodList()
      },
      onSizeChange(current, size) {
        this.page = 1
        this.pageSize = size
        this.getGoodList()
      },
      onRefresh(conditions) {
        this.conditions = conditions
        this.getGoodList()
      },
      onReset(conditions) {
        this.conditions = conditions
        this.getGoodList()
      },
      onPageChange(page, pageSize) {
        this.page = page
        this.pageSize = pageSize
        this.getGoodList()
      }
    }
  }
</script>

<style scoped lang="less">
.table{
  background-color: @base-bg-color;
  padding: 24px;
}
</style>