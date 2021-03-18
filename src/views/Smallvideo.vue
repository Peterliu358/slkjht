<template>
  <div class="smallvideo">
    <el-dropdown trigger="click" @command="handleCommand1" class="product">
      <span class="el-dropdown-link">
        选择产品<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="(item, index) in product"
            :key="'product' + index"
            :command="item.appcode"
            >{{ item.name }}</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-col :span="5" class="search">
      <el-input
        placeholder="请输入内容"
        v-model="input"
        class="input-with-select"
      >
        <template #append>
          <el-button icon="el-icon-search" @click="search"></el-button>
        </template>
      </el-input>
    </el-col>
    <el-row class="el-row2">
      <el-col :span="24">
        <el-table
          :data="
            data.slice((currentPage - 1) * pagesize, currentPage * pagesize)
          "
          style="width: 100%"
          border
          stripe
          highlight-current-row
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            align="center"
            width="80"
            sortable
          >
          <template #default="scope">
            <el-input v-model="scope.row.sort" maxlength="4" minlength="1" @blur="sortEdit2(scope.row)" @focus="sortEdit1(scope.row)"></el-input>
          </template>
          </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            width="50"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="appcode"
            label="产品编号"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="name"
            label="视频名称"
            align="center"
            width="140"
          >
            <template #default="scope">
              <span v-if="right == true">{{
                scope.row.course.coursename
              }}</span>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="coursecode"
            label="视频编码"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="topicode"
            label="栏目编码"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="duration"
            label="视频时长"
            align="center"
            width="80"
          >
            <template #default="scope">
              <span v-if="right == true">{{ scope.row.course.duration }}</span>
              <span v-else>{{ scope.row.duration }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="titleassetid"
            label="titleassetid"
            align="center"
            width="190"
          >
            <template #default="scope">
              <span v-if="right == true">{{
                scope.row.course.titleassetid
              }}</span>
              <span v-else>{{ scope.row.titleassetid }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="movieassetid"
            label="movieassetid"
            align="center"
            width="190"
          >
            <template #default="scope">
              <span v-if="right == true">{{
                scope.row.course.movieassetid
              }}</span>
              <span v-else>{{ scope.row.movieassetid }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="210"
            align="center"
          >
            <template #default="scope">
              <el-popconfirm
                title="确定删除或添加吗？"
                @confirm="handleDelete(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button
                    size="mini"
                    :type="right == false ? 'danger' : 'primary'"
                    >{{ right == false ? "删除" : "添加" }}</el-button
                  >
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[8, 16, 24, 32, 40]"
      :page-size="pagesize"
      :total="dataLength"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      product: [],
      appcode: "sl1001",
      input: "",
      data: [],
      pagesize: 8,
      currentPage: 1,
      dataLength: 0,
      right: false,
      name: "",
      sort: "",
    };
  },
  mounted() {
    this.axios
      .get(this.$store.state.host + "apps/getApps")
      .then((response) => {
        this.product = response.data.rowData;
      })
      .catch((error) => {
        console.log(error);
      });
    this.axios
      .get(
        this.$store.state.host +
          "smallVideo/getSmallVideo?appcode=sl1001&page=1&limit=8"
      )
      .then((response) => {
        this.data = response.data.rowData;
        this.dataLength = response.data.rowCount;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    tableData() {
      this.axios
        .get(
          this.$store.state.host +
            "smallVideo/getSmallVideo?appcode=" +
            this.appcode +
            "&page=" +
            this.currentPage +
            "&limit=" +
            this.pagesize
        )
        .then((response) => {
          if (response.data.rowData != null) {
            this.data = response.data.rowData;
          }
          else{
              this.data = [];
              this.dataLength = response.data.rowCount;
          }
          this.dataLength = response.data.rowCount;
          this.right = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    tableSearchData() {
      this.axios
        .get(
          this.$store.state.host +
            "course/getCourseByContent?appcode=" +
            this.appcode +
            "&content=" +
            this.input +
            "&pageNum=" +
            this.currentPage +
            "&pageSize=" +
            this.pagesize
        )
        .then((response) => {
          if (response.data.rowData != null) {
            this.data = response.data.rowData;
          }
          else{
              this.data = [];
              this.dataLength = response.data.rowCount;
          }
          this.dataLength = response.data.rowCount;
          this.right = true;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCommand1(command) {
      this.appcode = command;
      this.tableData();
    },
    handleSizeChange(val) {
      this.pagesize = val;
      this.tableData();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.tableData();
    },
    search() {
      if (this.input != "") {
        this.tableSearchData();
      }
    },
    handleDelete(index, row) {
      if (this.right == false) {
        this.axios
          .get(this.$store.state.host + "smallVideo/delSmallVideo?id=" + row.id)
          .then((response) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.tableData();
          })
          .catch((error) => {
            this.$message({
              message: "删除失败",
              type: "error",
            });
            console.log(error);
          });
      } else {
        this.axios
          .get(
            this.$store.state.host +
              "smallVideo/saveSmallVideo?appcode=" +
              this.appcode +
              "&name=" +
              row.course.coursename +
              "&topicode=" +
              row.topicode +
              "&coursecode=" +
              row.coursecode +
              "&titleassetid=" +
              row.course.titleassetid +
              "&duration=" +
              row.course.duration
          )
          .then((response) => {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.tableData();
          })
          .catch((error) => {
            this.$message({
              message: "删除失败",
              type: "error",
            });
            console.log(error);
          });
      }
    },
    sortEdit1(row){
      this.sort = row.sort;
    },
    sortEdit2(row){
      if(this.sort != row.sort){
        this.axios
          .get(
            this.$store.state.host +
              "smallVideo/modifySort?id=" +
              row.id +
              "&sort=" +
              row.sort
          )
          .then((response) => {
            this.$message({
              message: response.data.retMsg,
              type: "success",
            });
            this.tableData();
          })
          .catch((error) => {
            this.$message({
              message: "排序失败",
              type: "error",
            });
            console.log(error);
          });
      }
    }
  },
};
</script>

<style src="@/assets/css/smallvideo.scss" scoped lang="scss">
</style>