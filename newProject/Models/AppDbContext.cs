using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace newProject.Models;

public partial class AppDbContext : DbContext
{
    public AppDbContext()
    {
    }

    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Exam> Exams { get; set; }

    public virtual DbSet<Grade> Grades { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("Data Source=(localdb)\\ProjectModels;Initial Catalog=AppDbProject;Integrated Security=True;Connect Timeout=30;Encrypt=False;TrustServerCertificate=False;ApplicationIntent=ReadWrite;MultiSubnetFailover=False");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Answer__3214EC07B3291344");

            entity.ToTable("Answer");

            entity.HasIndex(e => e.IdQuestion, "IX_Answer_Id_Question");

            entity.Property(e => e.AnswerText)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.IdQuestion).HasColumnName("Id_Question");

            entity.HasOne(d => d.IdQuestionNavigation).WithMany(p => p.AnswersNavigation)
                .HasForeignKey(d => d.IdQuestion)
                .HasConstraintName("FK__Answer__Id_Quest__46E78A0C");
        });

        modelBuilder.Entity<Exam>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Exam__3214EC075E558033");

            entity.ToTable("Exam");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.Date)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Grades)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Questions)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.StartTime)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Teacher)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.TypeExam)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        modelBuilder.Entity<Grade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Grade__3214EC0750BC4A01");

            entity.ToTable("Grade");

            entity.HasIndex(e => e.IdExam, "IX_Grade_Id_Exam");

            entity.HasIndex(e => e.IdStudent, "IX_Grade_Id_Student");

            entity.Property(e => e.IdExam).HasColumnName("Id_Exam");
            entity.Property(e => e.IdStudent).HasColumnName("Id_Student");

        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Question__3214EC07C1BB782A");

            entity.ToTable("Question");

            entity.HasIndex(e => e.IdExam, "IX_Question_Id_Exam");

            entity.Property(e => e.Answers)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.IdExam).HasColumnName("Id_Exam");
            entity.Property(e => e.QuestionText)
                .HasMaxLength(255)
                .IsUnicode(false);

            entity.HasOne(d => d.IdExamNavigation).WithMany(p => p.QuestionsNavigation)
                .HasForeignKey(d => d.IdExam)
                .HasConstraintName("FK__Question__Id_Exa__440B1D61");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Users__3214EC070FC57515");

            entity.Property(e => e.Id).ValueGeneratedNever();
            entity.Property(e => e.IsStudent).HasColumnName("isStudent");
            entity.Property(e => e.Name)
                .HasMaxLength(255)
                .IsUnicode(false);
            entity.Property(e => e.Password)
                .HasMaxLength(255)
                .IsUnicode(false);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
