<template>
  <div class="api">
    <div class="introduce">
      <h2 class="title">illustrate</h2>
      <p class="content">
        AdvanceTable is encapsulated with the Ant Design Vue Table component and supports all of its APIs。<br/>
        Mainly added<em>Column settings</em>及<em>Search for control configuration</em>can be used in some scenarios where you need to dynamically configure table presentations and dynamically configure search criteria。<br/>
        How you use it is basically the same as antd table. Some APIs have been added, as follows:
      </p>
    </div>
    <api-table :api-source="apiSource" />
    <api-table type="event" title="event" :api-source="events" />
    <api-table title="Column" :api-source="columnApi" />
    <api-table title="Search" :api-source="searchApi" />
  </div>
</template>

<script>
  import ApiTable from '@/components/table/api/ApiTable'
  export default {
    name: 'Api',
    components: {ApiTable},
    data() {
      return {
        apiSource: [
          {
            key: 0,
            param: '<a href="https://www.antdv.com/components/table-cn/#API" target="_blank">Ant Design Vue Table API</a>',
            desc: '支持 Ant Design Vue Table Components all api',
            type: '--',
            default: '--',
          },
          {
            key: 1,
            param: 'title',
            desc: 'The table title',
            type: 'string | slot',
            default: '\'Advanced tables\''
          },
          {
            key: 2,
            param: 'formatConditions',
            desc: `Whether to format the value of the search criteria, format the rule reference <a>Search disposition</a>。
                   <br/>false：Take the original value of the search input control<br/>true：Take the value of the search input control formatted`,
            type: 'boolean',
            default: 'false',
          },
          {
            key: 3,
            param: 'columns',
            desc: `Table column configuration, reference <a>Column disposition</a>`,
            type: 'array',
            default: '--',
          }
        ],
        events: [
          {
            key: 0,
            param: '<a href="https://www.antdv.com/components/table-cn/#API" target="_blank">Ant Design Vue Table Events API</a>',
            desc: '支持 Ant Design Vue Table All events',
            callback: '--',
          },
          {
            key: 1,
            param: 'search',
            desc: 'Triggered when the search criteria change',
            callback: 'Function(conditions, searchOptions: [{field, value, format}])',
          },
          {
            key: 2,
            param: 'refresh',
            desc: 'Triggered when the header refresh icon clicks',
            callback: 'Function(conditions, searchOptions: [{field, value, format}])',
          },
          {
            key: 3,
            param: 'reset',
            desc: 'The column configuration reset button is triggered when clicked',
            callback: 'Function(conditions, searchOptions: [{field, value, format}])',
          },
        ],
        columnApi: [
          {
            key: 0,
            param: '<a href="https://www.antdv.com/components/table-cn/#API" target="_blank">Ant Design Vue Table Column API</a>',
            desc: 'Supports the Ant Design Vue Table component Column configuration of all apis',
            type: '--',
            default: '--'
          },
          {
            key: 1,
            param: 'searchAble',
            desc: 'Whether column search is enabled',
            type: 'boolean',
            default: 'false'
          },
          {
            key: 2,
            param: 'dataType',
            desc: `The data type, which determines the type of column search input control, corresponds to the column search input control as follows：<br/>
                   string: Enter the box component<br/>
                   boolean: Switch components<br/>
                   select: Drop-down input box components<br/>
                   date: Date selector<br/>
                   time: Time selector<br/>
                   datetime: Date selector with time selector`,
            type: `'string' | 'boolean' | 'select' | 'date' | 'time' | 'datetime'`,
            default: `'string'`
          },
          {
            key: 3,
            param: 'search',
            desc: 'Column search configuration, reference <a>Search disposition</a>',
            type: 'object',
            default: '--'
          },
        ],
        searchApi: [
          {
            key: 0,
            param: 'format',
            desc: `The column searches for a formatted configuration of the input control value. if the input control supports formatting, you can set the value to a string, such as a date input component 'YYYY-MM-DD'。
                   <br/>Formatted input controls are not supported and can be set to a function that receives the input value of the control as an argument, such as (value) => {return \`prefix\${value}\`}。`,
            type: 'string | Function(value)',
            default: 'Take the default formatting configuration for the input control'
          },
          {
            key: 1,
            param: 'selectOptions',
            desc: `select The option configuration of the drop-down input component for the data type can be referred to <a href="https://www.antdv.com/components/select-cn/#API" target="_blank">Ant Design Vue Select Option props Api</a>`,
            type: 'array',
            default: '--'
          }
        ],
      }
    }
  }
</script>

<style scoped lang="less">
.api{
  .introduce{
    padding: 16px;
    .content{
      em{
        margin: 0 4px;
        color: @primary-color;
      }
    }
  }
}
</style>