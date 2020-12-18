<!-- 添加界面 -->
<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        effect="dark"
        :closable="false"
        show-icon
        center
      >
      </el-alert>

      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          v-model="activeIndex"
          tab-position="left"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addForm.goods_number"
                type="text"
                oninput="value=value.replace(/[^\d]/g,'')"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyParams"
              :key="item.attr_id"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyAttr"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 预览图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="imgDialogVisible"
      width="50%"
    >
      <img :src="previewUrl" alt="" class="previewImg">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: '',
  data() {
    return {
      activeIndex: '0',

      // 表单对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 表单验证
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品名重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 级联选择器
      cateProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
      },
      // 商品分类列表
      catelist: [],
      // 商品参数
      manyParams: [],
      // 商品静态属性
      onlyAttr: [],
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上组件的headers请求头对象
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 保存图片的路径
      previewUrl: '',
      // 预览图片对话框显示与隐藏
      imgDialogVisible: false
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get(`categories`)
      if (res.meta.status !== 200) {
        return this.$message.console.error('获取商品分类列表失败！')
      }

      this.catelist = res.data
      // console.dir(this.catelist)
    },

    handleChange() {
      // console.dir(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },

    // 阻止tabs 切换
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },

    //
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败！')
        }

        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyParams = res.data
        // console.dir(this.manyParams)
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取商品参数失败！')
        }

        this.onlyAttr = res.data
        // console.dir(this.onlyAttr)
      }
    },

    // 处理图片预处理
    handlePreview(file) {
      console.log(file)
      this.previewUrl = file.response.data.url
      this.imgDialogVisible = true
    },
    // 处理移除图片操作
    handleRemove(file) {
      // console.dir(file)
      // 找到要删除的文件
      // 将文件从 pics 中移除
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((item) => {
        item.pic === filePath
      })
      this.addForm.pics.splice(i, 1)
      // console.dir(this.addForm)
    },
    // 图片上传成功调用
    handleSuccess(response) {
      // console.dir(response)
      const picInfo = {
        pic: response.data.tmp_path,
      }
      this.addForm.pics.push(picInfo)
      // console.dir(this.addForm)
    },

    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if(!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 处理动态参数
        const newInfo = {}
        this.manyParams.forEach(item => {
          newInfo.attr_id = item.attr_id
          newInfo.attr_value = item.attr_vals
          this.addForm.attrs.push(newInfo)
        })
        
        // 处理静态属性
        this.onlyAttr.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        // console.dir(form)

        const {data:res} = await this.$http.post(`goods`,form)

        if(res.meta.status !== 201) {
          return this.$message.error('添加是商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>

<style  lang='less' scoped>
.el-steps {
  margin: 15px 0;
}
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.el-button {
  margin: 15px 0;
}
</style>
