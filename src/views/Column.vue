<template>
  <div class="column">
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
    <el-dropdown
      trigger="click"
      @command="handleCommand2"
      class="state"
      v-if="online"
    >
      <span class="el-dropdown-link">
        内容状态<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="">全部</el-dropdown-item>
          <el-dropdown-item command="0">已上线</el-dropdown-item>
          <el-dropdown-item command="-2">待上线</el-dropdown-item>
          <el-dropdown-item command="-1">未上线</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-button type="primary" class="add" @click="dialogFormVisible = true"
      >添加一级栏目</el-button
    >
    <el-button type="danger" @click="courseOnline">节目上下线</el-button>
    <el-popconfirm title="确定移动吗？" @confirm="courseMove()">
      <template #reference>
        <el-button type="warning">移动</el-button>
      </template>
    </el-popconfirm>
    <el-dialog title="添加一级栏目" v-model="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="栏目名称" :label-width="formLabelWidth">
          <el-input v-model="form.columnName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="栏目描述" :label-width="formLabelWidth">
          <el-input v-model="form.columnDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addColumn">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="修改栏目" v-model="handleEditForm">
      <el-form :model="formEdit">
        <el-form-item label="栏目名称" :label-width="formLabelWidth">
          <el-input v-model="formEdit.columnName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="栏目描述" :label-width="formLabelWidth">
          <el-input v-model="formEdit.columnDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleEditForm = false">取 消</el-button>
          <el-button type="primary" @click="EditColumn">确 定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="添加子栏目" v-model="handleAddForm">
      <el-form :model="formAdd">
        <el-form-item label="栏目名称" :label-width="formLabelWidth">
          <el-input v-model="formAdd.columnName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="栏目描述" :label-width="formLabelWidth">
          <el-input v-model="formAdd.columnDesc" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleEditForm = false">取 消</el-button>
          <el-button type="primary" @click="addChildColumn">确 定</el-button>
        </span>
      </template>
    </el-dialog>
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
      <el-col :span="4">
        <el-tree
          :data="data"
          :props="defaultProps"
          :accordion="true"
          @node-click="treeClick"
          show-checkbox
          ref="tree"
        ></el-tree>
      </el-col>
      <el-col :span="20">
        <el-table
          :data="
            tableData.slice(
              (currentPage - 1) * pagesize,
              currentPage * pagesize
            )
          "
          style="width: 100%"
          border
          stripe
          v-if="!online"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column prop="id" label="ID" width="50" align="center">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            width="80"
            align="center"
            sortable
          >
          </el-table-column>
          <el-table-column
            prop="appcode"
            label="产品编号"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="topicname"
            label="栏目名称"
            align="center"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="topicode"
            label="栏目编码"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="parentcode"
            label="父级编码"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column
            prop="code"
            label="自身编码"
            align="center"
            width="80"
          >
          </el-table-column>
          <el-table-column label="状态" width="70" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isenable"
                @change="isuse1($event, scope.row)"
                :active-value="'0'"
                :inactive-value="'-1'"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="280"
            align="center"
          >
            <template #default="scope">
              <el-button
                size="mini"
                type="success"
                @click="handleLook(scope.$index, scope.row)"
                >查看</el-button
              >
              <el-button
                size="mini"
                type="warning"
                @click="handleEdit(scope.$index, scope.row)"
                >修改</el-button
              >
              <el-button
                size="mini"
                type="primary"
                @click="handleAdd(scope.$index, scope.row)"
                >添加</el-button
              >
              <el-popconfirm
                title="确定删除吗？"
                @confirm="handleDelete(scope.$index, scope.row)"
              >
                <template #reference>
                  <el-button size="mini" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="courseData"
          style="width: 100%"
          border
          stripe
          @selection-change="handleSelectionChange2"
          v-if="online"
          max-height="470"
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column prop="id" label="ID" width="70" align="center">
          </el-table-column>
          <el-table-column
            prop="sort"
            label="排序"
            width="80"
            align="center"
            sortable
          >
            <template #default="scope">
              <el-input
                v-model="scope.row.sort"
                maxlength="4"
                minlength="1"
                @blur="sortEdit2(scope.row)"
                @focus="sortEdit1(scope.row)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column
            prop="coursecode"
            label="视频编码"
            align="center"
            width="110"
          >
          </el-table-column>
          <el-table-column
            prop="course.coursename"
            label="视频名称"
            align="center"
            width="120"
          >
          </el-table-column>
          <el-table-column
            prop="object.topicname"
            label="视频栏目"
            align="center"
            width="150"
          >
            <template #default="scope">
              <span v-if="isSearch == false">{{ courseUrl }}</span>
              <span v-else>{{ topicname(scope) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="course.duration"
            label="视频时长"
            align="center"
            width="100"
          >
          </el-table-column>
          <el-table-column
            prop="course.titleassetid"
            label="titleassetid"
            align="center"
            width="110"
          >
          </el-table-column>
          <el-table-column
            prop="course.packageassetid"
            label="packageassetid"
            align="center"
            width="130"
          >
          </el-table-column>
          <el-table-column
            prop="status"
            label="上线状态"
            align="center"
            width="90"
          >
            <template #default="scope">
              <span v-if="scope.row.status == 0">已上线</span>
              <span v-else>未上线</span>
            </template>
          </el-table-column>
          <el-table-column label="是否免费" width="70" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.isfree"
                @change="isuse2($event, scope.row)"
                :active-value="'-1'"
                :inactive-value="'0'"
              ></el-switch>
            </template>
          </el-table-column>
        </el-table>
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
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      input: "",
      product: [],
      appcode: "sl1001",
      data: [],
      defaultProps: {
        children: "children",
        label: "topicname",
      },
      tableData: [],
      courseData: [],
      pagesize: 8,
      currentPage: 1,
      multipleSelection1: [],
      multipleSelection2: [],
      dialogFormVisible: false,
      handleEditForm: false,
      handleAddForm: false,
      form: {
        columnName: "",
        columnDesc: "",
      },
      formEdit: {
        columnName: "",
        columnDesc: "",
      },
      formAdd: {
        columnName: "",
        columnDesc: "",
      },
      formLabelWidth: "100px",
      idEdit: "",
      parentcode: "",
      topicode: "",
      online: false,
      dataLength: 0,
      isOnline: "",
      courseUrl: "",
      isSearch: false,
      moveLength: "",
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
        this.$store.state.host + "topic/getTopicList?appcode=" + this.appcode
      )
      .then((response) => {
        this.data = response.data.rowData;
      })
      .catch((error) => {
        console.log(error);
      });
    this.axios
      .get(
        this.$store.state.host +
          "topic/getTopicByParentCode?appcode=" +
          this.appcode +
          "&parentcode=0"
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
    columnData() {
      this.axios
        .get(
          this.$store.state.host + "topic/getTopicList?appcode=" + this.appcode
        )
        .then((response) => {
          this.data = response.data.rowData;
        })
        .catch((error) => {
          console.log(error);
        });
      this.axios
        .get(
          this.$store.state.host +
            "topic/getTopicByParentCode?appcode=" +
            this.appcode +
            "&parentcode=0" +
            "&page=1&limit=10"
        )
        .then((response) => {
          response.data.rowData == null
            ? (response.data.rowData = [])
            : response.data.rowData;
          this.tableData = response.data.rowData;
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    columnDataClick(data) {
      this.axios
        .get(
          this.$store.state.host +
            "topic/getTopicByTopicCode?appcode=" +
            this.appcode +
            "&topicode=" +
            data.topicode +
            "&page=1&limit=10"
        )
        .then((response) => {
          let arr = [];
          arr.push(response.data.rowData);
          this.tableData = arr;
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getCourseData() {
      this.axios
        .get(
          this.$store.state.host +
            "course/getCourseData?appcode=" +
            this.appcode +
            "&topicode=" +
            this.topicode +
            "&pageNum=" +
            this.currentPage +
            "&pageSize=" +
            this.pagesize
        )
        .then((response) => {
          this.courseData = response.data.rowData;
          this.isSearch = false;
          this.online = true;
          this.input = "";
          this.courseUrl = response.data.rowData[0].object.topicname;
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getOnlineCourseData() {
      this.axios
        .get(
          this.$store.state.host +
            "course/getCourseByAppcode?appcode=" +
            this.appcode +
            "&topicode=" +
            this.topicode +
            "&pageNum=" +
            this.currentPage +
            "&pageSize=" +
            this.pagesize +
            "&status=" +
            this.isOnline
        )
        .then((response) => {
          this.courseData = response.data.rowData;
          this.isSearch = false;
          this.online = true;
          this.input = "";
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getSearchData() {
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
          this.isSearch = true;
          this.online = true;
          this.courseData = response.data.rowData;
          this.dataLength = response.data.rowCount;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    open1() {
      ElMessage.success({
        message: "提交成功",
        type: "success",
      });
    },
    open2() {
      ElMessage.error("提交失败");
    },
    handleCommand1(command) {
      this.online = false;
      this.multipleSelection2 = [];
      this.appcode = command;
      this.columnData();
    },
    handleCommand2(command) {
      this.isOnline = command;
      this.getOnlineCourseData();
    },
    treeClick(data) {
      this.online = false;
      this.multipleSelection2 = [];
      this.columnDataClick(data);
    },
    handleSizeChange(val) {
      this.pagesize = val;
      if (this.online == false) {
        this.columnDataClick();
      } else if (this.isSearch == false) {
        this.getCourseData();
      } else {
        this.getSearchData();
      }
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      if (this.isSearch == false) {
        this.getCourseData();
      } else {
        this.getSearchData();
      }
    },
    isuse1(event, data) {
      this.axios
        .get(
          this.$store.state.host +
            "topic/modifyTopicIsenable?id=" +
            data.id +
            "&isenable=" +
            event
        )
        .then((response) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.columnData();
        })
        .catch((error) => {
          this.$message({
            message: "操作失败",
            type: "error",
          });
          console.log(error);
        });
    },
    isuse2(event, data) {
      this.axios
        .get(
          this.$store.state.host +
            "course/modifyCourseIsFree?id=" +
            data.id +
            "&isfree=" +
            event
        )
        .then((response) => {
          this.$message({
            message: "操作成功",
            type: "success",
          });
          this.columnData();
        })
        .catch((error) => {
          this.$message({
            message: "操作失败",
            type: "error",
          });
          console.log(error);
        });
    },
    handleSelectionChange2(val) {
      this.multipleSelection2 = val;
    },
    addColumn() {
      this.axios
        .get(
          this.$store.state.host +
            "topic/saveTopic?appcode=" +
            this.appcode +
            "&parentcode=0" +
            "&topicname=" +
            this.form.columnName +
            "&topicdesc=" +
            this.form.columnDesc
        )
        .then((response) => {
          this.dialogFormVisible = false;
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.columnData();
        })
        .catch((error) => {
          this.$message({
            message: "添加失败",
            type: "error",
          });
          console.log(error);
          this.dialogFormVisible = false;
        });
    },
    handleEdit(index, row) {
      this.handleEditForm = true;
      this.idEdit = row.id;
    },
    EditColumn() {
      this.axios
        .get(
          this.$store.state.host +
            "topic/modifyTopic?id=" +
            this.idEdit +
            "&topicname=" +
            this.formEdit.columnName +
            "&topicdesc=" +
            this.formEdit.columnDesc
        )
        .then((response) => {
          this.handleEditForm = false;
          this.$message({
            message: "修改成功",
            type: "success",
          });
          this.columnData();
        })
        .catch((error) => {
          this.$message({
            message: "修改失败",
            type: "error",
          });
          console.log(error);
          this.handleEditForm = false;
        });
    },
    handleAdd(index, row) {
      this.parentcode = row.code;
      this.topicode = row.topicode;
      this.handleAddForm = true;
    },
    addChildColumn() {
      this.axios
        .get(
          this.$store.state.host +
            "topic/saveTopic?appcode=" +
            this.appcode +
            "&parentcode=" +
            this.parentcode +
            "&topicode=" +
            this.topicode +
            "&topicname=" +
            this.formAdd.columnName +
            "&topicdesc=" +
            this.formAdd.columnDesc
        )
        .then((response) => {
          this.handleAddForm = false;
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.columnData();
        })
        .catch((error) => {
          this.$message({
            message: "添加失败",
            type: "error",
          });
          console.log(error);
          this.handleAddForm = false;
        });
    },
    handleDelete(index, row) {
      this.axios
        .get(this.$store.state.host + "topic/delTopic?id=" + row.id)
        .then((response) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.columnData();
        })
        .catch((error) => {
          this.$message({
            message: "删除失败",
            type: "error",
          });
          console.log(error);
        });
    },
    handleLook(index, row) {
      this.online = true;
      this.topicode = row.topicode;
      this.getCourseData();
    },
    courseOnline() {
      if (this.multipleSelection2.length > 0) {
        let idArr = [];
        for (const key in this.multipleSelection2) {
          idArr.push(this.multipleSelection2[key].id);
        }
        this.multipleSelection2[0].status == "0"
          ? (this.multipleSelection2[0].status = "-1")
          : (this.multipleSelection2[0].status = "0");
        this.axios
          .get(
            this.$store.state.host +
              "course/modifyStatus?id=" +
              idArr +
              "&status=" +
              this.multipleSelection2[0].status
          )
          .then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            if (this.isSearch == false) {
              this.getOnlineCourseData();
            } else {
              this.getSearchData();
            }
          })
          .catch((error) => {
            this.$message({
              message: "修改失败",
              type: "error",
            });
            console.log(error);
          });
      }
    },
    search() {
      if (this.input != "") {
        this.getSearchData();
      }
    },
    topicname(index) {
      if (index.row.object == null) {
        return "空";
      } else {
        let url = [];
        let name = index.row;
        let topicName = "";
        while (name.object != null) {
          url.push(name.object.topicname);
          name = name.object;
        }
        url.reverse();
        for (const iterator of url) {
          topicName += iterator + "-";
        }
        return topicName.substring(0, topicName.length - 1);
      }
    },
    courseMove() {
      if (
        this.$refs.tree.getCheckedNodes().length == 1 &&
        this.multipleSelection2.length > 0
      ) {
        let arr = [];
        for (const key in this.multipleSelection2) {
          arr.push(this.multipleSelection2[key].id);
        }
        // console.log(this.$refs.tree.getCheckedNodes()[0].topicode,arr);
        this.axios
          .get(
            this.$store.state.host +
              "course/modifyTopicode?id=" +
              arr +
              "&topicode=" +
              this.$refs.tree.getCheckedNodes()[0].topicode
          )
          .then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            if (this.isSearch == false) {
              this.getOnlineCourseData();
            } else {
              this.getSearchData();
            }
          })
          .catch((error) => {
            this.$message({
              message: "修改失败",
              type: "error",
            });
            console.log(error);
          });
      }
    },
    sortEdit1(row) {
      this.sort = row.sort;
    },
    sortEdit2(row) {
      if (this.sort != row.sort) {
        this.axios
          .get(
            this.$store.state.host +
              "course/modifySortById?id=" +
              row.id +
              "&sort=" +
              row.sort +
              "&appcode=" +
              this.appcode
          )
          .then((response) => {
            this.$message({
              message: response.data.retMsg,
              type: "success",
            });
            if (this.isSearch == true) {
              this.getSearchData();
            } else {
              this.getOnlineCourseData();
            }
          })
          .catch((error) => {
            this.$message({
              message: "排序失败",
              type: "error",
            });
            console.log(error);
          });
      }
    },
  },
};
</script>

<style src="@/assets/css/column.scss" scoped lang="scss">
</style>