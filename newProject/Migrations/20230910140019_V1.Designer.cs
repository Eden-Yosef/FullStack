﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using newProject.Models;

#nullable disable

namespace newProject.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20230910140019_V1")]
    partial class V1
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("newProject.Models.Answer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("AnswerText")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("IdQuestion")
                        .HasColumnType("int")
                        .HasColumnName("Id_Question");

                    b.HasKey("Id")
                        .HasName("PK__Answer__3214EC07B3291344");

                    b.HasIndex(new[] { "IdQuestion" }, "IX_Answer_Id_Question");

                    b.ToTable("Answer", (string)null);
                });

            modelBuilder.Entity("newProject.Models.Exam", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("int");

                    b.Property<string>("Date")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Grades")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Name")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Questions")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("StartTime")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Teacher")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("TotalTime")
                        .HasColumnType("int");

                    b.Property<string>("TypeExam")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id")
                        .HasName("PK__Exam__3214EC075E558033");

                    b.ToTable("Exam", (string)null);
                });

            modelBuilder.Entity("newProject.Models.Grade", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<int?>("GradeExam")
                        .HasColumnType("int");

                    b.Property<int?>("IdExam")
                        .HasColumnType("int")
                        .HasColumnName("Id_Exam");

                    b.Property<int?>("IdExamNavigationId")
                        .HasColumnType("int");

                    b.Property<int?>("IdStudent")
                        .HasColumnType("int")
                        .HasColumnName("Id_Student");

                    b.Property<int?>("IdStudentNavigationId")
                        .HasColumnType("int");

                    b.HasKey("Id")
                        .HasName("PK__Grade__3214EC0750BC4A01");

                    b.HasIndex("IdExamNavigationId");

                    b.HasIndex("IdStudentNavigationId");

                    b.HasIndex(new[] { "IdExam" }, "IX_Grade_Id_Exam");

                    b.HasIndex(new[] { "IdStudent" }, "IX_Grade_Id_Student");

                    b.ToTable("Grade", (string)null);
                });

            modelBuilder.Entity("newProject.Models.Question", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("Answers")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<int?>("IdExam")
                        .HasColumnType("int")
                        .HasColumnName("Id_Exam");

                    b.Property<string>("QuestionText")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id")
                        .HasName("PK__Question__3214EC07C1BB782A");

                    b.HasIndex(new[] { "IdExam" }, "IX_Question_Id_Exam");

                    b.ToTable("Question", (string)null);
                });

            modelBuilder.Entity("newProject.Models.User", b =>
                {
                    b.Property<int>("Id")
                        .HasColumnType("int");

                    b.Property<bool?>("IsStudent")
                        .HasColumnType("bit")
                        .HasColumnName("isStudent");

                    b.Property<string>("Name")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.Property<string>("Password")
                        .HasMaxLength(255)
                        .IsUnicode(false)
                        .HasColumnType("varchar(255)");

                    b.HasKey("Id")
                        .HasName("PK__Users__3214EC070FC57515");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("newProject.Models.Answer", b =>
                {
                    b.HasOne("newProject.Models.Question", "IdQuestionNavigation")
                        .WithMany("AnswersNavigation")
                        .HasForeignKey("IdQuestion")
                        .HasConstraintName("FK__Answer__Id_Quest__46E78A0C");

                    b.Navigation("IdQuestionNavigation");
                });

            modelBuilder.Entity("newProject.Models.Grade", b =>
                {
                    b.HasOne("newProject.Models.Exam", "IdExamNavigation")
                        .WithMany("GradesNavigation")
                        .HasForeignKey("IdExamNavigationId");

                    b.HasOne("newProject.Models.User", "IdStudentNavigation")
                        .WithMany("Grades")
                        .HasForeignKey("IdStudentNavigationId");

                    b.Navigation("IdExamNavigation");

                    b.Navigation("IdStudentNavigation");
                });

            modelBuilder.Entity("newProject.Models.Question", b =>
                {
                    b.HasOne("newProject.Models.Exam", "IdExamNavigation")
                        .WithMany("QuestionsNavigation")
                        .HasForeignKey("IdExam")
                        .HasConstraintName("FK__Question__Id_Exa__440B1D61");

                    b.Navigation("IdExamNavigation");
                });

            modelBuilder.Entity("newProject.Models.Exam", b =>
                {
                    b.Navigation("GradesNavigation");

                    b.Navigation("QuestionsNavigation");
                });

            modelBuilder.Entity("newProject.Models.Question", b =>
                {
                    b.Navigation("AnswersNavigation");
                });

            modelBuilder.Entity("newProject.Models.User", b =>
                {
                    b.Navigation("Grades");
                });
#pragma warning restore 612, 618
        }
    }
}
