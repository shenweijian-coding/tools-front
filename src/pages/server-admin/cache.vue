<template>
  <a-form :model="cacheForm.form" layout="inline">
    <a-form-item label="类型:">
      <a-radio-group v-model="cacheForm.form.mark">
        <a-radio v-for="o in cacheForm.cacheWebList" :key="o.val" :value="o.val">{{ o.name }}</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="文件名:">
      <a-input v-model="cacheForm.form.file" placeholder="文件名"></a-input>
    </a-form-item>
    <a-form-item label="素材ID:">
      <a-input v-model="cacheForm.form.sc_id" placeholder="素材ID"></a-input>
    </a-form-item>
    <a-form-item>
      <a-space>
        <a-button type="primary" @click="getCacheInfo">搜索</a-button>
      </a-space>
    </a-form-item>
  </a-form>
  <a-divider orientation="center"></a-divider>
  <a-button type="primary" @click="cacheForm.showAddCache = true">添加</a-button>

  <a-table class="mt-m"  :data="cacheForm.tableData" size="small" bordered 
    :pagination="cacheForm.pagination" 
    @page-change="pageChange">
    <template #columns>
      <a-table-column title="文件名" data-index="file" align="center"></a-table-column>
      <a-table-column title="类型" data-index="ext" align="center"></a-table-column>
      <a-table-column title="素材ID" data-index="sc_id" align="center"></a-table-column>
      <a-table-column title="类型" data-index="type" align="center"></a-table-column>
      <a-table-column title="网站" data-index="mark" align="center"></a-table-column>
      <a-table-column title="subid" data-index="subid" align="center"></a-table-column>
      <a-table-column title="直链" data-index="link" align="center"></a-table-column>
      <a-table-column title="操作" align="center">
      <template #cell="{ record }">
        <!-- <a-button type="text" @click="handleConfig(record)">编辑</a-button> -->
        <a-button type="text" @click="deleteCache(record)">删除</a-button>
      </template>
    </a-table-column>
    </template>
  </a-table>

  <s-dialog :visible="cacheForm.showAddCache" width="40%" title="添加/配置" @close="close">
    <a-form :model="cacheForm.form" layout="">
      <a-form-item label="识别：">
        <a-input-search
        placeholder="链接"
        v-model="cacheForm.scUrl"
        button-text="搜索"
        search-button
        @search="autoWrite"/>
      </a-form-item>
      <a-form-item label="类型" v-if="cacheForm.cacheOptions.length">
        <a-radio-group @change="cacheOptionChange">
          <a-radio v-for="(it,i) in cacheForm.cacheOptions" :value="i" :key="i">{{ it.text }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="网站：">
        <a-select v-model="cacheForm.createForm.mark" placeholder="网站" style="width: 120px">
          <a-option v-for="o of cacheForm.cacheWebList" :value="o.val" :label="o.name" :key="o.val"/>
        </a-select>
      </a-form-item>
      <a-form-item label="文件名：">
        <a-input v-model="cacheForm.createForm.file" placeholder="文件名"></a-input>
      </a-form-item>
      <a-form-item label="类型:">
        <a-radio-group v-model="cacheForm.createForm.ext">
          <a-radio v-for="it in ['.zip', '.rar', '.jpg', '.png', '.mp3', '.mp4']" :key="it" :value="it">{{ it }}</a-radio>
        </a-radio-group>
        <a-input v-model="cacheForm.createForm.ext" placeholder="类型" style="width: 120px"></a-input>
      </a-form-item>
      <a-form-item label="分类:">
        <a-input v-model="cacheForm.createForm.type" placeholder="分类" style="width: 120px"></a-input>
      </a-form-item>
      <a-form-item label="素材ID:">
        <a-input v-model="cacheForm.createForm.sc_id" placeholder="素材ID"></a-input>
      </a-form-item>
      <a-form-item label="subid:">
        <a-input v-model="cacheForm.createForm.subid" placeholder="subid" style="width: 120px"></a-input>
      </a-form-item>
      <a-form-item label="直链:">
        <a-input v-model="cacheForm.createForm.link" placeholder="直链"></a-input>
      </a-form-item>
    </a-form>
    <template #footer>
      <a-space>
        <a-button type="outline" @click="close">关闭</a-button>
        <a-button type="primary" @click="confirm">确定</a-button>
      </a-space>
    </template>
  </s-dialog>
</template>

<script setup>
import { getCacheByWeb, deleteCacheApi, updateCache } from '@/api/admin/index'
import { Message } from '@arco-design/web-vue';
import { dateFormate } from '@/utils/index'
import { getPngUrl } from '@api/sucai/index'

const cacheForm = reactive({
  cacheWebList: [
    {name: '千图网',val: '58pic'},
    {name: '包图网',val: 'ibaotu'},
    {name: '觅知网',val: '51miz'},
    {name: '摄图网',val: '699pic'},
    {name: '熊猫办公',val: 'tukuppt'},
    {name: '觅元素',val: '51yuansu'},
    {name: '众图网',val: 'ztupic'},
    {name: '字魂网',val: 'izihun'},
    {name: '办图网',val: '888ppt'},
    {name: '稻壳网',val: 'docer'},
    {name: '六图网',val: '16pic'},
    {name: '风云办公',val: 'ppt118'},
    {name: '千库网',val: '588ku'},
    {name: '求字体',val: 'qiuziti'},
    {name: '90设计',val: '90sheji'},
    {name: '图精灵',val: '616pic'},
    {name: '图品汇',val: '88tph'},
  ],
  form: {
    mark: '58pic',
    file: '',
    sc_id: '',
  },
  createForm: {
    file: '/' + dateFormate() + '-',
    ext: '',
    sc_id: '',
    type: '',
    subid: '0',
    link: ''
  },
  tableData: [{  }],
  pagination:{
    total: 0,
    current: 1,
    'show-total': true,
    'page-size': 10
  },
  showAddCache: false,
  isEdit: false,
  scUrl: '',
  cacheOptions: []
})

const search = () => {

}

const autoWrite = async() => {
  if(!cacheForm.scUrl) {
    return
  }
  const res = await getPngUrl({
    url: cacheForm.scUrl
  })
  cacheForm.cacheOptions = res.data.options ? res.data.options : []
}

const cacheOptionChange = (index) => {
  const { mark, parentid, subid, type } = cacheForm.cacheOptions[index]
  cacheForm.createForm.sc_id = parentid
  cacheForm.createForm.type = type
  cacheForm.createForm.subid = subid
  cacheForm.createForm.mark = mark

}

const getCacheInfo = async () => {
  const res = await getCacheByWeb({
    ...cacheForm.form,
    pageNum: cacheForm.pagination.current
  })
  cacheForm.tableData = res.data.list || []
  cacheForm.pagination.total = res.data.total || 0
}
getCacheInfo()

const pageChange = (page) => {
  cacheForm.pagination.current = page
  getCacheInfo()
}
const close = () => {
  cacheForm.showAddCache = false
  cacheForm.isEdit = false
  cacheForm.cacheOptions = []
  cacheForm.scUrl = ''
  cacheForm.createForm = {
    file: '/' + dateFormate() + '-',
    ext: '',
    sc_id: '',
    type: '',
    subid: '0',
    link: '',
    mark: ''
  }
}
const handleConfig = (row) => {
  cacheForm.showAddCache = true
  cacheForm.isEdit = true
  cacheForm.createForm = { ...row }
}

const confirm = async () => {
  const res = await updateCache({
    ... cacheForm.createForm,
    isEdit: cacheForm.isEdit
  })
  console.log(res);
  Message.success(res.msg)
  close()
}
const deleteCache = async (row) => {
  const res = await deleteCacheApi({ file: row.file, mark: row.mark })
  console.log(res);
  getCacheInfo()
  Message.success(res.msg)
}

</script>