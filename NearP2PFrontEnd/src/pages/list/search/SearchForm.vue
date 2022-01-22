<template>
  <a-card :bordered="false" class="search-form">
    <a-form :form="form">
      <form-row label="The class item to which it belongs">
        <a-form-item>
          <tag-select>
            <tag-select-option>Class One</tag-select-option>
            <tag-select-option>Class two</tag-select-option>
            <tag-select-option>Class three</tag-select-option>
            <tag-select-option>Class four</tag-select-option>
            <tag-select-option>Class five</tag-select-option>
            <tag-select-option>Class six</tag-select-option>
            <tag-select-option>Class seven</tag-select-option>
            <tag-select-option>Class eight</tag-select-option>
            <tag-select-option>Class nine</tag-select-option>
            <tag-select-option>Class 10</tag-select-option>
            <tag-select-option>Class XI</tag-select-option>
            <tag-select-option>Class XIIE</tag-select-option>
            <tag-select-option>Class XI Thirteen</tag-select-option>
            <tag-select-option>Class XIVI</tag-select-option>
            <tag-select-option>Class XVI</tag-select-option>
            <tag-select-option>Class XVI</tag-select-option>
          </tag-select>
        </a-form-item>
      </form-row>
      <form-row label="owner" style="padding-bottom: 11px">
        <a-form-item>
          <a-select
            mode="multiple" style="max-width: 286px"
            v-decorator="['owner', {initialValue: ['1', '2']}]"
          >
            <a-select-option value="3">Myself</a-select-option>
            <a-select-option value="1">Wu Jiahao</a-select-option>
            <a-select-option value="2">Zhou Xing</a-select-option>
            <a-select-option value="4">Li ning</a-select-option>
          </a-select>
        </a-form-item>
        <a @click="lookMyself">Just look at yourself</a>
      </form-row>
      <form-row label="Other options">
        <a-row>
          <a-col :span="8">
            <a-form-item label="Active users" :labelCol="{span: 6}" :wrapperCol="{span: 12}">
              <a-select placeholder="Unlimited">
                <a-select-option value="1">Zhou Xing</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item
              label="Praise"
              :labelCol="{span: 6}"
              :wrapperCol="{span: 12}"
            >
              <a-select placeholder="Unlimited">
                <a-select-option value="1">Outstanding</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
      </form-row>
    </a-form>
  </a-card>
</template>

<script>
import TagSelect from '../../../components/tool/TagSelect'
import FormRow from '../../../components/form/FormRow'

const TagSelectOption = TagSelect.Option

export default {
  name: 'SearchForm',
  components: {FormRow, TagSelectOption, TagSelect},
  data() {
    return {
      form: this.$form.createForm(this)
    }
  },
  methods: {
    lookMyself () {
      this.form.setFieldsValue({
        owner: '3'
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .search-form{
    margin-bottom: 24px;
  }
</style>
