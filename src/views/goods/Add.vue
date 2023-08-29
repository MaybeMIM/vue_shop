<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
      <!-- 步骤条 -->
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
        <el-step title="完成！"></el-step>
      </el-steps>

      <!-- tab栏区域 -->
      <el-form
        label-position="top"
        :model="addForm"
        :rules="addRules"
        ref="addForm"
        label-width="100px"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>

            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"> </el-input
            ></el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight" type="number"></el-input>
            </el-form-item>

            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的Item项 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- action 要上传的api -->
            <el-upload
              :on-success="handleSuccess"
              :headers="headerObj"
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器组件 -->
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <!-- 添加商品的按钮 -->
              <el-button type="primary" class="btnAdd" @click="add">添加商品</el-button>
            
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

<!-- 图片预览 -->
    <el-dialog
  title="图片预览"
  :visible.sync="dialogVisible"
  width="50%"
  >
  <img :src="previewPath" alt="" class="previewImg">
  </span>
</el-dialog>
  </div>
</template>

<script>
import { cloneDeep } from "lodash";
import { getCateList, getParamsList, addGoods } from "../../api";
export default {
  name: "Add",
  data() {
    return {
      // 图片上传url地址 /upload
      uploadURL: "http://127.0.0.1:8888/api/private/v1/upload",
      // 图片上传组件的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 步骤条激活步骤索引值
      activeIndex: 0,
      // 添加商品的表单数据对象
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类数组 (选中商品的分类id)
        goods_cat: [],
        // 上传图片临时路径
        pics: [],
        // 商品的详情描述
        goods_introduce: "",
        // 将动静态的参数属性循环处理然后push到这来
        attrs: [],
      },
      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
      // 商品分类列表
      cateList: [],
      cateProps: {
        // 所看见的名字
        label: "cat_name",
        // 所选择的值
        value: "cat_id",
        children: "children",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态参数列表数据
      onlyTableData: [],
      // 预览图片的图片绝对路径
      previewPath: "",
      dialogVisible: false,
    };
  },
  computed: {
    cateId() {
      // 计算三级分类商品的id
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    // 获取所有商品分类列表
    getCateListed() {
      getCateList().then(({ data }) => {
        if (data.meta.status !== 200) {
          return this.$message.error("获取商品分类数据失败");
        }
        this.cateList = data.data;
      });
    },
    // 级联选择器选中变化会触发函数
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
        this.$message.error("请选择三级商品分类！");
      }
    },
    // 切换tab页签之前的 钩子函数 返回false 则不会切换
    beforeTabLeave(activeName, oldName) {
      if (oldName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选中商品分类！");
        return false;
      }
    },
    // 点击tab页签触发事件
    tabClicked() {
      // 访问的是动态参数面板
      if (this.activeIndex === "1") {
        getParamsList(this.cateId, { params: { sel: "many" } }).then(
          ({ data }) => {
            if (data.meta.status !== 200) {
              return this.$message.error("获取动态参数数据失败");
            }
            // 在赋值之前做循环 将字符串用空格隔开变成数组
            data.data.forEach((item) => {
              // 先判断是否为空 再重新赋值回去
              item.attr_vals =
                item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
            });
            this.manyTableData = data.data;
          }
        );
      } else if (this.activeIndex === "2") {
        getParamsList(this.cateId, { params: { sel: "only" } }).then(
          ({ data }) => {
            if (data.meta.status !== 200) {
              return this.$message.error("获取静态参数数据失败");
            }
            this.onlyTableData = data.data;
          }
        );
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.dialogVisible = true;
      this.previewPath = file.response.data.url;
    },
    // 点击移除图片时
    handleRemove(file) {
      // 1 获取到file的各种信息
      const filePath = file.response.data.tmp_path;
      // 2 从 pics 数组中 找到这个图片的索引值 (item为pics对象中的每一项)
      const i = this.addForm.pics.findIndex((item) => item.pic === filePath);
      // 3 调用数组 splice 把图片信息对象从pics数组中移除
      this.addForm.pics.splice(i, 1);
    },
    // 监听图片上传成功的事件
    handleSuccess(res) {
      // console.log(res);
      // 将图片信息push到pics数组中
      this.addForm.pics.push({ pic: res.data.tmp_path });
    },
    // 添加商品
    add() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }
        // 执行添加的逻辑
        // lodash cloneDeep(obj) 深拷贝 与原数据分开

        const form = cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // const form = JSON.parse(JSON.stringify(this.addForm)); 这样的深拷贝也没问题
        // form.goods_cat = form.goods_cat.join(",");
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            // 需要是字符串
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });

        // 静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };

          this.addForm.attrs.push(newInfo);
        });
        // 深拷贝的form的attrs是没有数据的
        form.attrs = this.addForm.attrs;

        // 发起请求添加商品
        addGoods(form).then(({ data }) => {
          if (data.meta.status !== 201) {
            return this.$message.error("添加商品失败");
          }
          this.$message.success("添加商品成功");
          this.$router.push("/goods");
        });
      });
    },
  },
  created() {
    this.getCateListed();
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>