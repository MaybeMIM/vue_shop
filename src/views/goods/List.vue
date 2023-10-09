<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row :gutter="40">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsListed"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsListed"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name"> </el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="135px">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="95px">
        </el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="175px">
          <template slot-scope="scope">
            <!-- 调用时间过滤器 -->
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250px">
          <template slot-scope="scope">
            <el-button type="danger" icon="el-icon-delete" @click="deleteGood(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, deleteGood } from "../../api";
export default {
  name: "List",
  data() {
    return {
      // 查询对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      //   商品列表
      goodsList: [],
      // 总数据条数 实现分页
      total: 0,
    };
  },
  methods: {
    // 获取商品列表
    getGoodsListed() {
      getGoodsList({ params: this.queryInfo }).then(({ data }) => {
        // console.log(data);
        if (data.meta.status !== 200) {
          return this.$message.error("获取商品列表失败");
        }
        // this.$message.success("获取商品列表成功");

        this.goodsList = data.data.goods;
        this.total = data.data.total;
      });
    },
    handleSizeChange(newSize) {
      // 拿到最新转到的页数 再次获取列表
      this.queryInfo.pagesize = newSize;
      this.getGoodsListed();
    },
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsListed();
    },
    // 删除商品
    deleteGood(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteGood(id).then(({ data }) => {
            console.log(data);
            if (data.meta.status !== 200) {
              return this.$message.error("删除商品失败");
            }
            this.$message.success("删除商品成功");
            this.getGoodsListed();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    goAddPage() {
      this.$router.push("/goods/add");
    },
  },
  created() {
    this.getGoodsListed();
  },
};
</script>

<style></style>