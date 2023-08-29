<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        class="tree-table"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        border
        :show-row-hover="false"
      >
        <!-- 是否有效 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-edit"
            @click="handleCateFrom(scope.row)"
            >编辑</el-button
          >
          <!-- 删除 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deletecate(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 12]"
        :page-size="querInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 对话框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addVisible"
      width="50%"
      @close="addCateClose"
    >
      <!-- 添加分类表单 -->
      <el-form
        :model="addCateForm"
        :rules="rules"
        ref="addCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" prop="cat_name">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader
            class="el-cascader"
            expand-trigger="hover"
            :options="parentCateList"
            v-model="selectedKeys"
            :props="cateProps"
            clearable
            change-on-select
            @change="handleChange"
          >
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <el-dialog title="编辑分类" :visible.sync="editVisible" width="50%">
      <el-form
        :model="editFrom"
        :rules="rules"
        ref="editCateForm"
        label-width="100px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editFrom.cat_name"></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCateList, addCate, editCate, deleteCate } from "../../api";
export default {
  name: "cate",
  data() {
    return {
      // 查询商品列表条件
      querInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类数据列表
      cateList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的各项定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板的名称
          template: "isOk",
        },
        {
          label: "排序",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板的名称
          template: "order",
        },
        {
          label: "操作",
          // 将当前列定义为模板列
          type: "template",
          // 当前模板的名称
          template: "opt",
        },
      ],
      // 添加分类对话框
      addVisible: false,
      editVisible: false,
      // 商品分类表单数据对象
      addCateForm: {
        // 将要添加的分类名称
        cat_name: "",
        // 父级分类的id
        cat_pid: 0,
        // 当前默认添加分类为一级分类
        cat_level: 0,
      },
      // 添加分类的表单验证规则
      rules: {
        cat_name: {
          required: true,
          message: "请输入分类名称",
          trigger: "blur",
        },
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级分类id数组
      selectedKeys: [],
      editFrom: {},
    };
  },
  methods: {
    getCateListed() {
      getCateList({ params: this.querInfo }).then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) {
          return this.$message.error("获取商品分类失败");
        }
        this.cateList = data.data.result;
        this.total = data.data.total;
      });
    },
    // 监听pagesize变化
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.querInfo.pagesize = newSize;
      this.getCateListed();
    },
    // 监听 页码值的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.querInfo.pagenum = newPage;
      this.getCateListed();
    },
    // 选择项发生变化
    handleChange() {
      // 如果 selecKeys 数组中的 length 大于0 ，证明选中了父级分类
      // 反之 就没有选择任何父级分类
      if (this.selectedKeys.length > 0) {
        // 当前父级分类id 永远为数组中的最后一项
        this.addCateForm.cat_pid =
          this.selectedKeys[this.selectedKeys.length - 1];
        // 当前分类的等级 为数组的长度
        this.addCateForm.cat_level = this.selectedKeys.length;
        return;
      } else {
        // 当前父级分类id
        this.addCateForm.cat_pid = 0;
        // 当前分类的等级 为数组的长度
        this.addCateForm.cat_level = 0;
      }
    },
    // 对话框关闭 重置表单
    addCateClose() {
      this.$refs.addCateForm.resetFields();
      this.selectedKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    // 添加分类商品
    showAddCate() {
      // 先获取父级分类的数据列表
      getCateList({ params: { type: 2 } }).then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) {
          return this.$message.error("获取父级分类失败");
        }
        this.parentCateList = data.data;
      });
      // 再展示对话框
      this.addVisible = true;
    },
    // 确定商品分类
    addCate() {
      this.$refs.addCateForm.validate((valid) => {
        if (!valid) return;
        // 通过验证 发起添加商品请求
        addCate(this.addCateForm).then(({ data }) => {
          if (data.meta.status !== 201) {
            return this.$message.error("添加分类失败");
          }
          this.$message.success("添加分类成功");
        });
      });
      this.getCateListed();

      this.addVisible = false;
    },
    // 编辑
    handleCateFrom(row) {
      this.editFrom = JSON.parse(JSON.stringify(row));
      this.editVisible = true;
    },
    // 确定编辑分类
    editCateForm() {
      this.$refs.editCateForm.validate((valid) => {
        if (!valid) return;
        editCate(this.editFrom).then(({ data }) => {
          // console.log(data);
          if (data.meta.status !== 200) {
            return this.$message.error("编辑分类失败");
          }
          this.$message.success("编辑分类成功");
          this.addCateForm.cat_name = data.data.cat_name;
        });
      });

      this.addVisible = false;
    },
    // 删除分类
    deletecate(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteCate(id).then(({ data }) => {
            console.log(data);
            if (data.meta.status !== 200) {
              return this.$message.error("删除分类失败");
            }
            this.$message.success("删除分类成功");
            this.getCateListed();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
  mounted() {
    this.getCateListed();
  },
};
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>