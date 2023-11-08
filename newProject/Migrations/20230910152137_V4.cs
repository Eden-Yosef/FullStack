using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace newProject.Migrations
{
    /// <inheritdoc />
    public partial class V4 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grade_Exam_IdExamNavigationId",
                table: "Grade");

            migrationBuilder.DropForeignKey(
                name: "FK_Grade_Users_IdStudentNavigationId",
                table: "Grade");

            migrationBuilder.DropIndex(
                name: "IX_Grade_IdExamNavigationId",
                table: "Grade");

            migrationBuilder.DropColumn(
                name: "IdExamNavigationId",
                table: "Grade");

            migrationBuilder.RenameColumn(
                name: "IdStudentNavigationId",
                table: "Grade",
                newName: "ExamId");

            migrationBuilder.RenameIndex(
                name: "IX_Grade_IdStudentNavigationId",
                table: "Grade",
                newName: "IX_Grade_ExamId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_Exam_ExamId",
                table: "Grade",
                column: "ExamId",
                principalTable: "Exam",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Grade_Exam_ExamId",
                table: "Grade");

            migrationBuilder.RenameColumn(
                name: "ExamId",
                table: "Grade",
                newName: "IdStudentNavigationId");

            migrationBuilder.RenameIndex(
                name: "IX_Grade_ExamId",
                table: "Grade",
                newName: "IX_Grade_IdStudentNavigationId");

            migrationBuilder.AddColumn<int>(
                name: "IdExamNavigationId",
                table: "Grade",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Grade_IdExamNavigationId",
                table: "Grade",
                column: "IdExamNavigationId");

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_Exam_IdExamNavigationId",
                table: "Grade",
                column: "IdExamNavigationId",
                principalTable: "Exam",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Grade_Users_IdStudentNavigationId",
                table: "Grade",
                column: "IdStudentNavigationId",
                principalTable: "Users",
                principalColumn: "Id");
        }
    }
}
