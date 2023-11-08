using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace newProject.Migrations
{
    /// <inheritdoc />
    public partial class V1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Exam",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Teacher = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Date = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    StartTime = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    TotalTime = table.Column<int>(type: "int", nullable: true),
                    TypeExam = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Questions = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Grades = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Exam__3214EC075E558033", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false),
                    isStudent = table.Column<bool>(type: "bit", nullable: true),
                    Password = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    Name = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Users__3214EC070FC57515", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Question",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Id_Exam = table.Column<int>(type: "int", nullable: true),
                    Answers = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true),
                    QuestionText = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Question__3214EC07C1BB782A", x => x.Id);
                    table.ForeignKey(
                        name: "FK__Question__Id_Exa__440B1D61",
                        column: x => x.Id_Exam,
                        principalTable: "Exam",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Grade",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Id_Exam = table.Column<int>(type: "int", nullable: true),
                    Id_Student = table.Column<int>(type: "int", nullable: true),
                    GradeExam = table.Column<int>(type: "int", nullable: true),
                    IdExamNavigationId = table.Column<int>(type: "int", nullable: true),
                    IdStudentNavigationId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Grade__3214EC0750BC4A01", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Grade_Exam_IdExamNavigationId",
                        column: x => x.IdExamNavigationId,
                        principalTable: "Exam",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Grade_Users_IdStudentNavigationId",
                        column: x => x.IdStudentNavigationId,
                        principalTable: "Users",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Answer",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Id_Question = table.Column<int>(type: "int", nullable: true),
                    AnswerText = table.Column<string>(type: "varchar(255)", unicode: false, maxLength: 255, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__Answer__3214EC07B3291344", x => x.Id);
                    table.ForeignKey(
                        name: "FK__Answer__Id_Quest__46E78A0C",
                        column: x => x.Id_Question,
                        principalTable: "Question",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Answer_Id_Question",
                table: "Answer",
                column: "Id_Question");

            migrationBuilder.CreateIndex(
                name: "IX_Grade_Id_Exam",
                table: "Grade",
                column: "Id_Exam");

            migrationBuilder.CreateIndex(
                name: "IX_Grade_Id_Student",
                table: "Grade",
                column: "Id_Student");

            migrationBuilder.CreateIndex(
                name: "IX_Grade_IdExamNavigationId",
                table: "Grade",
                column: "IdExamNavigationId");

            migrationBuilder.CreateIndex(
                name: "IX_Grade_IdStudentNavigationId",
                table: "Grade",
                column: "IdStudentNavigationId");

            migrationBuilder.CreateIndex(
                name: "IX_Question_Id_Exam",
                table: "Question",
                column: "Id_Exam");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Answer");

            migrationBuilder.DropTable(
                name: "Grade");

            migrationBuilder.DropTable(
                name: "Question");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Exam");
        }
    }
}
