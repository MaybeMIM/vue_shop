<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 视图 -->
    <el-card>
      <!-- 添加与搜索 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model.trim="queryInfo.query"
            clearable
            @clear="getUserListd"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserListd"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="handleAdd">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区 -->
      <el-table :data="userList" border stripe>
        <el-table-column label="#" type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope"
            ><el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch
          ></template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="handleEdit(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <!-- 分配权限 -->
              <el-button
                type="warning"
                icon="el-icon-setting"
                @click="setRole(scope.row)"
              ></el-button
            ></el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      :title="modalType === 0 ? '添加用户' : '编辑用户'"
      :visible.sync="isVisible"
      width="50%"
      @close="DialogClose"
    >
      <!-- 表单 -->
      <el-form
        :model="addForm"
        :rules="rules"
        ref="addForm"
        label-width="70px"
        status-icon
        inline
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="addForm.username"
            :disabled="modalType === 0 ? false : true"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" v-show="modalType !== 1">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限的对话框 -->
    <el-dialog title="分配角色" :visible.sync="Rolevisible" width="50%">
      <div>
        <p>当前用户：{{ userinfo.username }}</p>
        <p>当前角色：{{ userinfo.role_name }}</p>
        <p>
          分配新角色：<el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="Rolevisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getUserList,
  updateUserState,
  addUser,
  EditUser,
  deleteUser,
  getRolesList,
  EditRole,
} from "../api";
export default {
  name: "Users",
  data() {
    // 自定义校验邮箱和手机规则
    // var checkEmail = (rule, value, cb) => {
    //   const regEmail =
    //     /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9_-])+/;
    //   if (regEmail.test(value)) {
    //     // 合法邮箱
    //     return cb();
    //   }
    //   cb(new Error("请输入合法邮箱"));
    // };
    // var checkMobile = (rule, value, cb) => {
    //   const regMobile =
    //     /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    //   if (regMobile.test(value)) {
    //     return cb();
    //   }
    //   cb(new Error("请输入合法手机号"));
    // };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        // 当前每页显示数据条数
        pagesize: 2,
      },
      userList: [],
      total: 0,
      isVisible: false,
      // 添加用户的表单数据
      addForm: {
        id: "",
        username: "",
        password: "",
        email: "",
        mobile: "",
      },

      modalType: 0, // 0表示新增的弹窗 1表示编辑的弹窗

      // 表单验证规则对象
      rules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          { min: 3, max: 10, message: "长度在3-10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在6-15个字符", trigger: "blur" },
        ],
        email: [
          {
            type: "email",
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          // { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          // { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 分配权限对话框
      Rolevisible: false,
      // 想要被分配角色的用户信息
      userinfo: {},
      // 所有角色的数据列表
      roleList: [],
      // 已选择的角色id值
      selectRoleId: "",
    };
  },
  methods: {
    // 获取用户数据列表
    getUserListd() {
      getUserList({ params: this.queryInfo }).then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) return this.$message.error(data.meta.msg);
        this.userList = data.data.users;
        this.total = data.data.total;
      });
    },
    // 监听pagesize变化
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserListd();
    },
    // 监听 页码值的事件
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserListd();
    },
    // 监听switch状态的改变
    userStateChanged(userinfo) {
      updateUserState(userinfo).then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) {
          userinfo.mg_state = !userinfo.mg_state;
          return this.$message.error("更新状态失败");
        }
        this.$message.success("更新状态成功");
      });
    },
    // 监听添加用户对话框的关闭事件
    DialogClose() {
      this.isVisible = false;

      this.$refs.addForm.resetFields();
      this.addForm = {};
    },
    // 添加用户
    submit() {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          // 通过验证 发起添加用户请求
          if (this.modalType === 0) {
            addUser(this.addForm).then(({ data }) => {
              if (data.meta.status !== 201) {
                return this.$message.error("添加用户失败");
              }
              this.$message.success("添加用户成功");
              this.getUserListd();
            });
          } else {
          }
        }
        if (this.modalType === 1) {
          EditUser(this.addForm).then(({ data }) => {
            console.log(data);
            if (data.meta.status !== 200) {
              return this.$message.error("更新用户失败");
            }
            this.$message.success("更新用户成功");
            this.getUserListd();
          });
        }
        this.DialogClose();
      });
    },
    handleAdd() {
      this.modalType = 0;
      this.isVisible = true;
    },
    // 展示编辑用户对话框
    handleEdit(row) {
      // 先点添加再点编辑没问题 但是先点编辑再点添加用户拷贝就会出问题
      // console.log(row);
      this.modalType = 1;
      this.isVisible = true;
      // 注意需要对当前行的数据进行深拷贝，拷贝后的对象与原来的对象是完全隔离的 不能直接赋值修改数据
      this.addForm = JSON.parse(JSON.stringify(row));
    },
    // 更加id删除对应用户信息
    removeUser(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 发起请求删除用户信息
          deleteUser(id).then(() => {
            this.getUserListd();
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
    // 展开分配角色对话框
    setRole(userinfo) {
      this.userinfo = userinfo;
      // 获取所有角色列表
      getRolesList().then(({ data }) => {
        if (data.meta.status !== 200) {
          return this.$message.error("获取角色列表失败！");
        }
        this.roleList = data.data;
      });

      this.Rolevisible = true;
    },
    // 点击确定 分配角色
    saveRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择要分配的角色");
      }
      EditRole(this.userinfo, { rid: this.selectRoleId }).then(({ data }) => {
        if (data.meta.status !== 200) {
          return this.$message.error("更新角色失败！");
        }
        this.$message.success("更新角色成功！");
        this.getUserListd();
        this.Rolevisible = false;
      });
    },
  },
  mounted() {
    this.getUserListd();
  },
};
</script>

<style scoped>
</style>