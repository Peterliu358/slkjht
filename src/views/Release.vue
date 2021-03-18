<template>
  <div class="release">
    <el-dropdown trigger="click" @command="handleCommand2" class="state">
      <span class="el-dropdown-link">
        内容状态<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="">全部</el-dropdown-item>
          <el-dropdown-item command="0">已发布</el-dropdown-item>
          <el-dropdown-item command="-1">未发布</el-dropdown-item>
          <el-dropdown-item command="-2">待上线</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button type="success" class="add" @click="dialogFormVisible = true"
      >注入视频</el-button
    >
    <el-button type="primary" @click="release">发布视频</el-button>
    <el-button type="warning" @click="courseOnline">视频上线</el-button>
    <el-popconfirm title="确定删除吗？" @confirm="del()">
      <template #reference>
        <el-button type="danger">删除视频</el-button>
      </template>
    </el-popconfirm>
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
          :data="tableData"
          style="width: 100%"
          border
          @selection-change="handleSelectionChange"
          stripe
          max-height="475"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column
            prop="id"
            label="ID"
            width="70"
            align="center"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="appcode"
            label="产品编码"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="titlename"
            label="视频名称"
            align="center"
            width="165"
          >
          </el-table-column>
          <el-table-column
            prop="coursecode"
            label="视频编码"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="category"
            label="视频地址"
            align="center"
            width="240"
          >
          </el-table-column>
          <el-table-column
            prop="runTime"
            label="视频时长"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="titleassetid"
            label="titleassetid"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="packageassetid"
            label="packageassetid"
            align="center"
            width="200"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="视频状态"
            align="center"
            width="80"
          >
            <template #default="scope">
              <span v-if="scope.row.status == '0'">已发布</span>
              <span v-if="scope.row.status == '-1'">未发布</span>
              <span v-if="scope.row.status == '-2'">待上线</span>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[9, 9 * 2, 9 * 3, 9 * 4, 9 * 5]"
      :page-size="pagesize"
      :total="dataLength"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <el-dialog
      title="视频注入"
      v-model="dialogFormVisible"
      destroy-on-close
      @close="dialogClose"
    >
      <el-upload
        class="upload-demo saveAdiList"
        :action="$store.state.host + 'adi/saveAdiList'"
        name="excel"
        accept=".xlsx"
        :on-success="saveSuccess"
      >
        <el-button size="small" type="primary">表格验证</el-button>
      </el-upload>
      <el-upload
        class="upload-demo saveAdiList1"
        :action="$store.state.host + 'adi/saveAdiList'"
        name="excel"
        accept=".xlsx"
        :data="{ status: '1' }"
        v-if="isStatus"
      >
        <el-button size="small" type="primary">提交</el-button>
      </el-upload>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      currentPage: 1,
      pagesize: 9,
      isOnline: false,
      isSearch: false,
      input: "",
      dataLength: 0,
      online: "",
      dialogFormVisible: false,
      isStatus: false,
      multipleSelection: [],
    };
  },
  mounted() {
    this.axios
      .get(
        this.$store.state.host +
          "adi/getAdiData?pageNum=" +
          this.currentPage +
          "&pageSize=" +
          this.pagesize
      )
      .then((response) => {
        this.tableData = response.data.rowData;
        this.dataLength = response.data.rowCount;
      })
      .catch((error) => {
        console.log(error);
      });
  },
  methods: {
    getTableData() {
      this.axios
        .get(
          this.$store.state.host +
            "adi/getAdiData?pageNum=" +
            this.currentPage +
            "&pageSize=" +
            this.pagesize
        )
        .then((response) => {
          this.tableData = response.data.rowData;
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTableOnlineData() {
      this.axios
        .get(
          this.$store.state.host +
            "adi/getAdiData?pageNum=" +
            this.currentPage +
            "&pageSize=" +
            this.pagesize +
            "&status=" +
            this.online
        )
        .then((response) => {
          this.tableData = response.data.rowData;
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getTableSearchData() {
      this.axios
        .get(
          this.$store.state.host +
            "adi/findAdiByContent?pageNum=" +
            this.currentPage +
            "&pageSize=" +
            this.pagesize +
            "&content=" +
            this.input
        )
        .then((response) => {
          this.tableData = response.data.rowData;
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    handleCommand2(command) {
      this.online = command;
      this.currentPage = 1;
      this.input = "";
      this.isOnline = true;
      this.isSearch = false;
      this.getTableOnlineData();
    },
    courseOnline() {
      if (this.online == "-2") {
        if (this.multipleSelection.length > 0) {
          let idArr = [];
          for (const key in this.multipleSelection) {
            idArr.push(this.multipleSelection[key].id);
          }
          this.axios
            .get(this.$store.state.host + "adi/batchImport?id=" + idArr)
            .then((response) => {
              this.$message({
                message: response.data.retMsg,
                type: "success",
              });
              if (this.isOnline == false && this.isSearch == false) {
                this.getTableData();
              } else if (this.isOnline == true) {
                this.getTableOnlineData();
              } else if (this.isSearch == true) {
                this.getTableSearchData();
              }
            })
            .catch((error) => {
              console.log(error);
              this.$message({
                message: response.data.retMsg,
                type: "error",
              });
            });
        } else {
          this.$message({
            message: "尚未选择视频",
            type: "error",
          });
        }
      } else {
        this.$message({
          message: "请更改内容状态为“待上线”",
          type: "error",
        });
      }
    },
    search() {
      if (this.input != "") {
        this.currentPage = 1;
        this.isOnline = false;
        this.isSearch = true;
        this.getTableSearchData();
      }
    },
    handleSizeChange(val) {
      this.pagesize = val;
      if (this.isOnline == false && this.isSearch == false) {
        this.getTableData();
      } else if (this.isOnline == true) {
        this.getTableOnlineData();
      } else if (this.isSearch == true) {
        this.getTableSearchData();
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      if (this.isOnline == false && this.isSearch == false) {
        this.getTableData();
      } else if (this.isOnline == true) {
        this.getTableOnlineData();
      } else if (this.isSearch == true) {
        this.getTableSearchData();
      }
    },
    saveSuccess() {
      this.isStatus = true;
    },
    dialogClose() {
      this.isStatus = false;
    },
    del() {
      if (this.multipleSelection.length > 0) {
        let idArr = [];
        for (const key in this.multipleSelection) {
          idArr.push(this.multipleSelection[key].id);
        }
        this.axios
          .get(this.$store.state.host + "adi/delAdi?id=" + idArr)
          .then((response) => {
            this.$message({
              message: response.data.retMsg,
              type: "success",
            });
            if (this.isOnline == false && this.isSearch == false) {
              this.getTableData();
            } else if (this.isOnline == true) {
              this.getTableOnlineData();
            } else if (this.isSearch == true) {
              this.getTableSearchData();
            }
          })
          .catch((error) => {
            console.log(error);
            this.$message({
              message: response.data.retMsg,
              type: "error",
            });
          });
      } else {
        this.$message({
          message: "尚未选择视频",
          type: "error",
        });
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    release() {
      let idArr = [];
      for (const key in this.multipleSelection) {
        idArr.push(this.multipleSelection[key].id);
      }
      this.axios
        .get(this.$store.state.host + "adi/getAdiById?id=" + idArr)
        .then((response) => {
          this.$message({
            message: response.data.retMsg,
            type: "success",
          });
          if (this.isOnline == false && this.isSearch == false) {
            this.getTableData();
          } else if (this.isOnline == true) {
            this.getTableOnlineData();
          } else if (this.isSearch == true) {
            this.getTableSearchData();
          }
        })
        .catch((error) => {
          console.log(error);
          this.$message({
            message: response.data.retMsg,
            type: "error",
          });
        });
    },
  },
};
</script>

<style src="@/assets/css/release.scss" scoped lang="scss">
</style>