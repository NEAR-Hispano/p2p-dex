<template>
  <div>
    <search-form />
    <a-card :bordered="false">
      <a-list itemLayout="vertical">
        <a-list-item :key="n" v-for="n in 10">
          <a-list-item-meta title="Alipay">
            <div slot="description">
              <a-tag >Ant Design</a-tag>
              <a-tag >Design language</a-tag>
              <a-tag >Ant gold suit</a-tag>
            </div>
          </a-list-item-meta>
          <div class="content">
            <div class="detail">
              Paragraph signal: Ant gold suit design platform ant.design, with minimal workload, seamless access to ant gold suit ecology, to provide cross-design and development experience solutions. Ant Gold suit design platform
              ant.design，Seamlessly connect to ant gold suit ecology with minimal effort, providing experience solutions across design and development.
            </div>
            <div class="author">
              <a-avatar size="small" src="https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png" />
              <a>ICZER</a>Posted in
              <a href="https://github.com/iczer">https://github.com/iczer</a>
              <em>2018-08-05 22:23</em>
            </div>
          </div>
          <span slot="actions"><a-icon style="margin-right: 8px" type="star-o" />156</span>
          <span slot="actions"><a-icon style="margin-right: 8px" type="like-o" />1435</span>
          <span slot="actions"><a-icon style="margin-right: 8px" type="message" />4</span>
        </a-list-item>
      </a-list>
    </a-card>
  </div>
</template>

<script>
import SearchForm from './SearchForm'
export default {
  name: 'ArticleList',
  components: {SearchForm}
}
</script>

<style lang="less" scoped>
  .extra{
    width: 272px;
    height: 1px;
  }
  .content {
    .detail {
      line-height: 22px;
      max-width: 720px;
    }
    .author {
      color: @text-color-second;
      margin-top: 16px;
      line-height: 22px;
      & > :global(.ant-avatar) {
          vertical-align: top;
          margin-right: 8px;
          width: 20px;
          height: 20px;
          position: relative;
          top: 1px;
        }
      & > em {
          color: @disabled-color;
          font-style: normal;
          margin-left: 16px;
        }
    }
  }
</style>
