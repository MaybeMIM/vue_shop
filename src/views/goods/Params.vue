<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 视图 -->
    <el-card>
      <!-- 警告 -->
      <el-alert
        show-icon
        :close="false"
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
      >
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader
            expand-trigger="hover"
            :options="cateList"
            :props="cateProps"
            v-model="selectedCateList"
            @change="handleChange"
          >
          </el-cascader>
        </el-col>
      </el-row>
      <!-- 页签 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  class="tag"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- tag添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            :disabled="isBtnDisabled"
            @click="addVisible = true"
            >添加属性</el-button
          >
          <!-- 静态属性表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  class="tag"
                  v-for="(item, i) in scope.row.attr_vals"
                  :key="i"
                  closable
                  @close="handleClose(i, scope.row)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- tag添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column label="#" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="activeName === 'many' ? '动态参数' : '静态属性'"
      :visible.sync="addVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="addForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addparams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数的对话框 -->
    <el-dialog
      title="修改"
      :visible.sync="editVisible"
      width="50%"
      @close="editDialogClose"
    >
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
      >
        <el-form-item
          :label="activeName === 'many' ? '动态参数' : '静态属性'"
          prop="attr_name"
        >
          <el-input v-model="editForm.attr_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editparams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getCateList,
  getParamsList,
  addParams,
  getParams,
  editParams,
  deleteParams,
} from "../../api";
export default {
  name: "Params",
  data() {
    return {
      // 商品分类列表
      cateList: [],
      //   级联选择框的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   级联选择框双向绑定
      selectedCateList: [],
      //   页签数据绑定
      activeName: "many",
      manyTableData: [],
      onlyTableData: [],
      //   添加对话框
      addVisible: false,
      //   修改对话框
      editVisible: false,
      //   添加参数表单数据
      addForm: {
        attr_name: "",
      },
      //   修改参数表单数据
      editForm: {},
      rules: {
        attr_name: { required: true, message: "请输入名称", trigger: "blur" },
      },
      //   默认隐藏文本输入框
      //   inputVisible: false,
      //   文本框中输入的内容
      //   inputValue: "",
    };
  },
  methods: {
    getCateListed() {
      // 获取所有商品分类
      getCateList().then(({ data }) => {
        if (data.meta.status !== 200) {
          return this.$message.error("获取商品分类失败");
        }
        this.cateList = data.data;
        // console.log(this.cateList);
      });
    },
    // 获取参数列表数据
    getParamsData() {
      //   如果选中的不是三级分类就返回出去并清空数组
      if (this.selectedCateList.length !== 3) {
        this.selectedCateList = [];
        return;
      }
      //   选择了三级分类 根据所选分类的id，和当前所处的面板 获取对应的参数
      getParamsList(this.cateId, { params: { sel: this.activeName } }).then(
        ({ data }) => {
          //   console.log(data);
          if (data.meta.status !== 200) {
            return this.$message.error("获取商品参数失败");
          }
          // 循环将每个参数中的小面板筛选出来
          data.data.forEach((item) => {
            // 判断是否为空  为空就给空数组 不然会有空白的tag标签出来
            item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
            // 添加一个布尔值 控制文本框的显示与隐藏
            item.inputVisible = false;
            // 文本框中输入的值
            item.inputValue = "";
          });
          if (this.activeName === "many") {
            this.manyTableData = data.data;
          } else {
            this.onlyTableData = data.data;
          }
        }
      );
    },
    // 页签点击
    handleTabClick() {
      // 获取参数列表数据
      this.getParamsData();
    },
    // 级联选择框变化
    handleChange() {
      // 获取参数列表数据
      this.getParamsData();
    },
    // 对话框关闭
    addDialogClose() {
      this.$refs.addForm.resetFields();
    },
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },

    // 添加参数
    addparams() {
      this.$refs.addForm.validate((valid) => {
        if (!valid) return;
        addParams(this.cateId, {
          attr_name: this.addForm.attr_name,
          attr_sel: this.activeName,
        }).then(({ data }) => {
          //   console.log(data);
          if (data.meta.status !== 201) {
            return this.$message.error("添加商品参数失败");
          }
          this.$message.success("添加商品参数成功");
        });
        this.addVisible = false;
        this.getParamsData();
      });
    },
    // 展示编辑对话框
    showEditDialog(attr_id) {
      getParams(this.cateId, attr_id, this.activeName).then(({ data }) => {
        if (data.meta.status !== 200) {
          return this.$message.error("获取商品参数失败");
        }
        this.editForm = data.data;
      });
      this.editVisible = true;
    },
    // 编辑参数
    editparams() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) return;
        editParams(this.cateId, this.editForm.attr_id, {
          attr_name: this.editForm.attr_name,
          attr_sel: this.activeName,
        }).then(({ data }) => {
          //   console.log(data);
          if (data.meta.status !== 200) {
            return this.$message.error("修改商品参数失败");
          }
          this.$message.success("修改商品参数成功");
          this.getParamsData();
          this.editVisible = false;
        });
      });
    },
    // 删除参数
    removeparams(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发起请求删除用户信息
          deleteParams(this.cateId, id).then(({}) => {
            this.getParamsData();
          });
          this.$message({
            type: "success",
            message: "删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 文本框失去焦点 按下回车键都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return 则需要做后续处理
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      //   发起请求 保存这次操作
      editParams(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      }).then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) {
          return this.$message.error("修改商品参数失败");
        }
        this.$message.success("修改商品参数成功");
      });
    },
    // 点击按钮 展示输入文本框
    showInput(row) {
      row.inputVisible = true;
      // nexTick 页面上的元素被重新渲染更新后执行回调中的代码
      this.$nextTick((_) => {
        // 从组件实例 文本框 中获得 原始输入框对象 实现自动获得焦点
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除对应的参数可选项
    handleClose(i, row) {
      row.attr_vals.splice(i, 1);
      //   发起请求 保存这次操作
      editParams(this.cateId, row.attr_id, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(" "),
      }).then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) {
          return this.$message.error("修改商品参数失败");
        }
        this.$message.success("修改商品参数成功");
      });
    },
  },
  computed: {
    // 如果按钮需要被禁用 则返回true
    isBtnDisabled() {
      if (this.selectedCateList.length !== 3) {
        return true;
      }
      return false;
    },
    // 当前选中的三级分类id
    cateId() {
      if (this.selectedCateList.length === 3) {
        return this.selectedCateList[2];
      }
      return null;
    },
    // 动态计算标题的文本
    // titleText() {
    //   if (this.activeName === "many") {
    //     return "动态参数";
    //   } else {
    //     return "静态属性";
    //   }
    // },
  },
  mounted() {
    // 获取所有商品分类
    this.getCateListed();
  },
};
</script>

<style lang="less" scoped>
.cat_opt {
  margin: 15px 0;
}
.tag {
  margin: 10px;
}
.input-new-tag {
  width: 150px;
}
</style>