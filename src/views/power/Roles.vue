<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              :key="item1.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRight(scope.row, item1.id)">
                  {{ item1.authName }}
                </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级和三级权限 -->
              <el-col :span="19">
                <!-- 通过 for 循环 嵌套渲染二级权限 -->
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRight(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRight(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRight(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="isVisible" width="50%">
      <el-tree
        :data="rightList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getRolesList, deleteRight, getRight, allotRight } from "../../api";
export default {
  name: "Roles",
  data() {
    return {
      // 所有角色列表
      roleList: [],
      isVisible: false,
      // 所有权限列表
      rightList: [],
      // 树形控件的属性绑定对象
      treeProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点ID值
      defKeys: [],
      // 当前即将分配权限的角色id
      roleId: "",
    };
  },
  methods: {
    // 获取权限列表(封装)
    getRoleList() {
      getRolesList().then(({ data }) => {
        if (data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败！");
        }
        this.roleList = data.data;
      });
    },
    // 根据id删除对应权限
    removeRight(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          deleteRight(role, rightId).then(({ data }) => {
            // this.getRoleList
            // 重新将角色的权限赋值一次
            role.children = data.data;
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 展示分配权限的对话框
    showSetRight(role) {
      // 保存角色的id到数据中 方便后面的角色分配权限请求
      this.roleId = role.id;
      // 获取所有权限树形数据
      getRight().then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) {
          return this.$message.error("获取权限失败");
        }
        this.rightList = data.data;
      });
      // 递归获取三级节点的id 角色role是最父级的节点拿到后开始递归
      this.defKeys = []; // 每次点击前先清空之前的数据再赋值
      this.getLeafKeys(role, this.defKeys);
      this.isVisible = true;
    },
    // 通过递归的形式获取角色下所有三级的权限并保存到数组
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性则是三级节点
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getLeafKeys(item, arr);
      });
    },
    // 为角色分配权限
    allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];
      // 每个id之间用，拼接成字符串
      const idStr = keys.join(",");
      allotRight(this.roleId, { rids: idStr }).then(({ data }) => {
        console.log(data);
        if (data.meta.status !== 200) {
          return this.$message.error("分配权限失败");
        }
        this.$message.success("分配成功");
        this.getRoleList();
      });
      this.isVisible = false;
    },
  },
  mounted() {
    this.getRoleList();
  },
};
</script>

<style lang="less" scoped>
.el-tag {
  margin: 7px 7px 10px 20px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>