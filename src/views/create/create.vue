<template>
  <news-detail :is-edit="false" />
</template>

<script>
import NewsDetail from './components/NewsDetail.vue'

export default {
  name: 'CreateArticle',
  components: { NewsDetail }
}
</script>

